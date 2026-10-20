"""Fetch public LeetCode stats at build time; no login, token or paid proxy.
On failure, preserve a validated last-good cache and disclose its age.
LeetCode's public GraphQL schema is not a guaranteed stable API.
"""
from pathlib import Path
from datetime import datetime, timezone
import argparse
import json
import os
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
QUERY = '''query PortfolioStats($username: String!, $year: Int!) {
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar(year: $year) { streak totalActiveDays }
    badges { id }
    tagProblemCounts {
      fundamental { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      advanced { tagName problemsSolved }
    }
  }
  allQuestionsCount { difficulty count }
}'''

def integer(value, field):
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ValueError('Invalid ' + field)
    return value

def counts(rows):
    if not isinstance(rows, list):
        raise ValueError('Missing difficulty rows')
    result = {r['difficulty']: integer(r['count'], 'count') for r in rows}
    if not all(k in result for k in ('All', 'Easy', 'Medium', 'Hard')):
        raise ValueError('Incomplete difficulty rows')
    return result

def validate_saved(stats, username):
    if not isinstance(stats, dict) or stats.get('sourceUsername', '').lower() != username.lower():
        raise ValueError('Saved snapshot belongs to a different account')
    for k in ('solved', 'easy', 'medium', 'hard', 'rank', 'activeDays', 'maxStreak', 'badges'):
        integer(stats.get(k), k)
    if stats['solved'] != stats['easy'] + stats['medium'] + stats['hard']:
        raise ValueError('Inconsistent solved counts')
    datetime.fromisoformat(stats['fetchedAt'])
    return stats

def parse(payload, username, year, now):
    if not isinstance(payload, dict) or payload.get('errors'):
        raise ValueError('GraphQL returned errors')
    user = payload.get('data', {}).get('matchedUser')
    if not user or user.get('username', '').lower() != username.lower():
        raise ValueError('Profile not found or username mismatch')
    solved = counts(user['submitStatsGlobal']['acSubmissionNum'])
    available = counts(payload['data']['allQuestionsCount'])
    if solved['All'] != sum(solved[k] for k in ('Easy', 'Medium', 'Hard')):
        raise ValueError('Inconsistent solved totals')
    if any(solved[k] > available[k] for k in ('Easy', 'Medium', 'Hard')):
        raise ValueError('Solved counts exceed available questions')
    calendar = user['userCalendar']
    active = integer(calendar['totalActiveDays'], 'active days')
    streak = integer(calendar['streak'], 'streak')
    if not 0 <= streak <= active <= 366:
        raise ValueError('Invalid calendar values')
    topics = {}
    for group in ('fundamental', 'intermediate', 'advanced'):
        for tag in user['tagProblemCounts'][group]:
            name = tag['tagName']
            if not isinstance(name, str) or not name:
                raise ValueError('Invalid topic')
            topics[name] = max(topics.get(name, 0), integer(tag['problemsSolved'], 'topic count'))
    badges = user['badges']
    if not isinstance(badges, list):
        raise ValueError('Invalid badges')
    stats = {
        'source': 'leetcode-graphql', 'sourceUsername': user['username'],
        'sourceUrl': 'https://leetcode.com/u/' + username + '/',
        'fetchedAt': now.isoformat(), 'sourceDate': now.date().isoformat(),
        'calendarYear': year, 'fetchStatus': 'ok',
        'solved': solved['All'], 'easy': solved['Easy'], 'medium': solved['Medium'], 'hard': solved['Hard'],
        'rank': integer(user['profile']['ranking'], 'ranking'),
        'activeDays': active, 'maxStreak': streak,
        'badges': len({str(b['id']) for b in badges}),
        'topics': dict(sorted(topics.items(), key=lambda x: (-x[1], x[0]))[:6]),
        'availableByDifficulty': {k: available[k] for k in ('Easy', 'Medium', 'Hard')},
    }
    return validate_saved(stats, username)

def fetch(username, year):
    body = json.dumps({'query': QUERY, 'variables': {'username': username, 'year': year}}).encode()
    request = urllib.request.Request('https://leetcode.com/graphql/', data=body, headers={
        'Content-Type': 'application/json', 'User-Agent': 'Ayush-Portfolio-Public-Stats/1.0',
        'Referer': 'https://leetcode.com/u/' + username + '/',
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)

def atomic(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    temp.replace(path)

def refresh(root=ROOT, fetcher=fetch):
    profile_path = root / 'data/profile.json'
    profile = json.loads(profile_path.read_text())
    username = profile.get('leetcodeUsername') or profile['username']
    now = datetime.now(timezone.utc)
    year = now.year
    cache_path = root / 'data/leetcode.json'
    last = profile.get('leetcode', {})
    if cache_path.exists():
        try:
            last = validate_saved(json.loads(cache_path.read_text()), username)
        except (ValueError, KeyError, TypeError):
            pass  # A malformed/wrong-user cache must never replace profile data.
    try:
        fresh = parse(fetcher(username, year), username, year, now)
    except Exception as error:
        # No fabricated values and no false "last updated now" timestamp.
        last = dict(last)
        last['fetchStatus'] = 'cached'
        last['lastAttemptAt'] = now.isoformat()
        last['lastFetchError'] = type(error).__name__
        profile['leetcode'] = last
        atomic(profile_path, profile)
        print('::warning::LeetCode refresh unavailable; keeping last-good data. ' + type(error).__name__)
        return False
    atomic(cache_path, fresh)
    profile['leetcode'] = fresh
    atomic(profile_path, profile)
    print(f"LeetCode {username}: {fresh['solved']} solved; rank {fresh['rank']}; calendar {year}; fetched {fresh['fetchedAt']}")
    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--strict', action='store_true', help='Exit nonzero on upstream failure (default keeps deploying cached stats).')
    args = parser.parse_args()
    ok = refresh()
    if args.strict and not ok:
        raise SystemExit(1)
