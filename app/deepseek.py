from openai import OpenAI
import sys
import json

data = None

if len(sys.argv) > 1:
    json_str = sys.argv[1]
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        print("Invalid json received")
else:
    print("no json data received")

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key = "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"
)

# prepare user message with real session JSON
session_json = json.dumps(data)
user_message = (
    f"Here is the collected session data in JSON form:\n{session_json}\n\n"
    "Please provide personalized recommendations as plain text bullet lists under two headings:\n"
    "- Break Recommendations\n"
    "- Productivity Tips\n"
    "Do not include any JSON formatting, braces, or quotes; just list the recommendations."
)

completion = client.chat.completions.create(
  model="deepseek/deepseek-chat",
  messages=[
    {
      "role": "system",
      "content": "You are a backend AI to infer user recommendations based on gathered data. The app's purpose is to create an eye tracking system to determine the user's productivity when working on digital devices. Data is collected when the user is working, and your task is to take that data and give the user some recommendations based on their studying habits on how they can personally improve. Does the user tend to be a short studier, or work in long sessions? etc",
    },
    {
      "role": "user",
      "content": user_message
    }
  ]
)

print(completion.choices[0].message.content)
