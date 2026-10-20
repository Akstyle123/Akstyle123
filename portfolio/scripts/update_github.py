"""Refresh public GitHub data. Python standard library; no paid APIs.
Optional GITHUB_TOKEN is server/Actions-only and is never saved in public files.
"""
from pathlib import Path
import datetime
import json
import os
import urllib.request
ROOT=Path(__file__).resolve().parents[1]

def fetch(path):
    headers={'Accept':'application/vnd.github+json','User-Agent':'Ayush-Interactive-Portfolio','X-GitHub-Api-Version':'2022-11-28'}
    if os.environ.get('GITHUB_TOKEN'):headers['Authorization']='Bearer '+os.environ['GITHUB_TOKEN']
    request=urllib.request.Request('https://api.github.com/'+path,headers=headers)
    with urllib.request.urlopen(request,timeout=30) as response:return json.load(response)

def main():
    username=json.loads((ROOT/'data/profile.json').read_text())['username']
    user=fetch('users/'+username)
    repos=[]
    page=1
    while True:
        batch=fetch(f'users/{username}/repos?per_page=100&type=owner&sort=updated&page={page}')
        repos.extend(batch)
        if len(batch)<100:break
        page+=1
    snapshot={'user':user,'repos':repos,'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    # Do not replace the last good snapshot unless every request succeeded.
    dest=ROOT/'data/github.json'
    temp=dest.with_suffix('.tmp')
    temp.write_text(json.dumps(snapshot,indent=2)+'\n')
    temp.replace(dest)
    print(f'Updated {len(repos)} public repositories.')

if __name__=='__main__':main()
