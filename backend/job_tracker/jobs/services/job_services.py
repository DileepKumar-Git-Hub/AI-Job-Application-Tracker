import requests

REMOTEOK_URL = "https://remoteok.com/api"
ARBEITNOW_URL = "http://arbeitnow.com/api/job-board-api"

def fetch_remotok_jobs():
    try:
        response = requests.get(REMOTEOK_URL, headers={"User-Agent":"Mozilla/5.0"})

        if response.status_code == 200:
            data =response.json()

            jobs = []
            for item in data[1:]:
                jobs.append({
                    "id": item.get("id"),
                    "title": item.get("position"),
                    "company": item.get("company"),
                    "location": item.get("location"),
                    "tags": item.get("tags") or [],
                    "apply_url": item.get("url"),
                    "source": "RemoteOK",
                    "description": item.get("description", ""),
                    "skills": item.get("tags") or [],
                    "salary": item.get("salary", "Not specified"),
                })
            return jobs
        return []
    except Exception as e:
        print("RemoteOK Error:",e)
        return []
    

def fetch_arbeitnow_jobs():
    try:
        response = requests.get(ARBEITNOW_URL)

        if response.status_code == 200:
            data = response.json()
            jobs = []
            for item in data.get("data", []):
                jobs.append({
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "company": item.get("company"),
                    "location": item.get("location"),
                    "tags": item.get("tags") or [],
                    "apply_url": item.get("url"),
                    "source": "ArbeitNow",
                    "description": item.get("description", ""),
                    "skills": item.get("tags") or [],
                    "salary": item.get("salary", "Not specified"),
                })
            return jobs
        return []
    except Exception as e:
        print("ArbeitNow Error:",e)
        return []



def get_all_jobs():
    remotok_jobs = fetch_remotok_jobs()
    arbeitnow_jobs = fetch_arbeitnow_jobs()
    all_jobs = remotok_jobs + arbeitnow_jobs
    return all_jobs