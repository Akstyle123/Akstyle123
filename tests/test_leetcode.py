import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('leetcode_updater', ROOT/'scripts/update_leetcode.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

def fixture():
    rows = [{'difficulty': k, 'count': v} for k,v in [('All',6),('Easy',1),('Medium',2),('Hard',3)]]
    return {'data': {'matchedUser': {'username':'Ayushkathoke','profile':{'ranking':123},
        'submitStatsGlobal':{'acSubmissionNum':rows},'userCalendar':{'streak':3,'totalActiveDays':5},
        'badges':[{'id':'a'},{'id':'b'}], 'tagProblemCounts':{'fundamental':[{'tagName':'Array','problemsSolved':4}], 'intermediate':[], 'advanced':[]}},
        'allQuestionsCount':[{'difficulty':r['difficulty'],'count':r['count']+100} for r in rows]}}

class LeetCodeTests(unittest.TestCase):
    def test_normalizes_and_dates_current_year(self):
        d=m.parse(fixture(),'ayushkathoke',2026,datetime(2026,10,20,tzinfo=timezone.utc))
        self.assertEqual(d['solved'],6);self.assertEqual(d['badges'],2)
        self.assertEqual(d['calendarYear'],2026);self.assertEqual(d['topics'],{'Array':4})
    def test_bad_total_rejected(self):
        d=fixture();d['data']['matchedUser']['submitStatsGlobal']['acSubmissionNum'][0]['count']=99
        with self.assertRaises(ValueError):m.parse(d,'Ayushkathoke',2026,datetime.now(timezone.utc))
    def test_graphql_error_rejected(self):
        with self.assertRaises(ValueError):m.parse({'errors':[{'message':'blocked'}]},'Ayushkathoke',2026,datetime.now(timezone.utc))
    def test_wrong_user_rejected(self):
        with self.assertRaises(ValueError):m.parse(fixture(),'SomeoneElse',2026,datetime.now(timezone.utc))
    def test_failure_retains_last_success_timestamp_and_count(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);(root/'data').mkdir()
            base=json.loads((ROOT/'data/profile.json').read_text())
            last=m.parse(fixture(),'Ayushkathoke',2026,datetime(2026,10,19,tzinfo=timezone.utc))
            base['leetcode']=copy.deepcopy(last)
            (root/'data/profile.json').write_text(json.dumps(base));(root/'data/leetcode.json').write_text(json.dumps(last))
            def blocked(*args):raise ConnectionError('test only')
            self.assertFalse(m.refresh(root,blocked))
            saved=json.loads((root/'data/profile.json').read_text())['leetcode']
            self.assertEqual(saved['solved'],6);self.assertEqual(saved['fetchedAt'],last['fetchedAt'])
            self.assertEqual(saved['fetchStatus'],'cached')
            self.assertEqual(json.loads((root/'data/leetcode.json').read_text()),last)
    def test_success_updates_both_files_without_other_profile_changes(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);(root/'data').mkdir()
            base=json.loads((ROOT/'data/profile.json').read_text())
            (root/'data/profile.json').write_text(json.dumps(base))
            self.assertTrue(m.refresh(root,lambda *args:fixture()))
            saved=json.loads((root/'data/profile.json').read_text())
            self.assertEqual(saved['certifications'],base['certifications'])
            self.assertEqual(saved['leetcode']['solved'],6)
            self.assertTrue((root/'data/leetcode.json').exists())

if __name__=='__main__':unittest.main()
