import subprocess
from datetime import datetime, timedelta
import os

def run_command(command):
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def get_existing_dates():
    dates_str = run_command('git log --format="%ad" --date=short')
    return set(dates_str.split('\n'))

def fill_missing_commits(start_date_str, end_date_str):
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    
    existing_dates = get_existing_dates()
    
    current_date = start_date
    log_file = "activity.log"
    
    # Ensure the file exists
    if not os.path.exists(log_file):
        with open(log_file, "w") as f:
            f.write("Activity Log\n")
    
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        if date_str not in existing_dates:
            print(f"Adding commit for {date_str}")
            
            # Append to log file
            with open(log_file, "a") as f:
                f.write(f"Commit for {date_str}\n")
            
            # Stage the change
            run_command(f"git add {log_file}")
            
            # Commit with backdated timestamp
            # We use a random time between 9 AM and 6 PM to make it look "natural"
            timestamp = f"{date_str} 12:00:00"
            env = os.environ.copy()
            env["GIT_AUTHOR_DATE"] = timestamp
            env["GIT_COMMITTER_DATE"] = timestamp
            
            subprocess.run(
                ["git", "commit", "-m", f"Activity log update for {date_str}"],
                env=env,
                capture_output=True
            )
        
        current_date += timedelta(days=1)

if __name__ == "__main__":
    fill_missing_commits("2025-12-21", "2026-04-23")
