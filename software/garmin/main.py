import os
from collections import defaultdict
from fitparse import FitFile

GARMIN_MONITOR_DIR = "/home/lane/Documents/2026-02-04-garmin-watch/Monitor"

def get_steps_per_day(path):
    fit_files = [os.path.join(path, f) for f in os.listdir(path) if f.endswith(".FIT")]
    if not fit_files:
        raise FileNotFoundError("No .FIT files found in Garmin Monitor folder")

    steps_per_day = defaultdict(int)

    for f in sorted(fit_files):
        fitfile = FitFile(f)

        for msg in fitfile.get_messages("monitoring"):
            data = {d.name: d.value for d in msg}
            steps = data.get("steps")
            ts = data.get("timestamp")

            if steps is not None and ts is not None:
                day = ts.date()
                # keep the max steps seen that day (since it's cumulative)
                steps_per_day[day] = max(steps_per_day[day], steps)

    # Print results sorted by date
    for day in sorted(steps_per_day.keys()):
        print(f"{day}: {steps_per_day[day]} steps")

if __name__ == "__main__":
    get_steps_per_day(GARMIN_MONITOR_DIR)

