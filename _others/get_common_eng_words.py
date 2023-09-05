import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.summerboardingcourses.com/blogs/500-most-common-words-in-english/"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

response = requests.get(URL, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')


# Find all the divs containing the words
word_divs = soup.find_all("div", class_="no-padding no-border text-block")

words = []

for div in word_divs:
    # Extract the words from the <p> tags
    word_list = div.find('p').get_text(separator="\n").split("\n")
    words.extend(word_list)

# Remove any unwanted characters or empty strings
cleaned_words = [word.strip() for word in words if word and not word.startswith("===")]

# Save the words to a JSON file
with open("words.json", "w") as file:
    json.dump(cleaned_words, file, indent=4)

print("Words saved to words.json!")