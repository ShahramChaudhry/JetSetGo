import pandas as pd

# Load the CSV file
csv_file = "visa_free.csv"
df = pd.read_csv(csv_file)

# Convert the DataFrame to JSON
json_file = "visa_data.json"
df.to_json(json_file, orient="records", indent=4)

print(f"CSV data has been converted to JSON and saved to {json_file}")