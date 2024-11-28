"""
This script runs the application using a development server.
It contains the definition of routes and views for the application.
"""
import logging
logging.basicConfig(level=logging.DEBUG)
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS
import nltk
nltk.download('punkt')
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from nltk.cluster import KMeansClusterer
from PyPDF2 import PdfReader
import google.generativeai as genai

app = Flask(__name__)

# Make the WSGI interface available at the top level so wfastcgi can get it.
wsgi_app = app.wsgi_app



CORS(app,origins=['http://localhost:5173'])  # Enable CORS for all routes

# Load SentenceTransformer model
model = SentenceTransformer('stsb-roberta-base')

# Function to extract text from PDF
def extract_text_from_pdf(file):
    text = ''
    for page_num in range(len(PdfReader(file.stream).pages)):
        text += PdfReader(file.stream).pages[page_num].extract_text()
    return text

# Function to summarize the article
def summarize_article(article):
    # Tokenize sentences
    sentences = nltk.sent_tokenize(article)
    sentences = [sentence.strip() for sentence in sentences]

    # Create DataFrame with sentences
    data = pd.DataFrame(sentences, columns=['sentence'])

    # Function to get sentence embeddings
    def get_sentence_embeddings(sentence):
        embedding = model.encode([sentence])
        return embedding[0]

    # Compute sentence embeddings
    data['embeddings'] = data['sentence'].apply(get_sentence_embeddings)

    # Number of clusters
    NUM_CLUSTERS = 10

    # KMeans clustering
    kclusterer = KMeansClusterer(NUM_CLUSTERS, distance=nltk.cluster.util.cosine_distance, repeats=25, avoid_empty_clusters=True)
    assigned_clusters = kclusterer.cluster(np.array(data['embeddings'].tolist()), assign_clusters=True)

    # Assign clusters to data
    data['cluster'] = assigned_clusters
    data['centroid'] = data['cluster'].apply(lambda x: kclusterer.means()[x])

    # Function to compute distance from centroid
    def distance_from_centroid(row):
        return np.linalg.norm(row['embeddings'] - row['centroid'])

    # Compute distance from centroid for each sentence
    data['distance_from_centroid'] = data.apply(distance_from_centroid, axis=1)

    # Generate summary
    summary = ' '.join(data.sort_values('distance_from_centroid', ascending=True).groupby('cluster').head(1).sort_index()['sentence'].tolist())

    return summary

def RegularizeText(text):
    text = text.replace('\n', ' ')
    text = text.replace('\r', ' ')
    text = text.replace('\t', ' ')
    text = text.replace('  ', ' ')
    text = text.replace('**', '')
    return text
# Function to send summary to AI for further modification
def further_summarize(text):
    # OpenAI API key (replace with your actual API key)
    API_KEY = 'AIzaSyDi1vy25v_gcdAyeeVyxLINQd1mlkUHKfg'
    
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat(history=[])
    chat.send_message(text)
    response = chat.send_message("Give a short summary covering the main points of the document.")
    reply= response.text
    return reply

def chatc(text, history,prompt):
    API_KEY = 'AIzaSyDi1vy25v_gcdAyeeVyxLINQd1mlkUHKfg'
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat()
    response = chat.send_message(
        f"Here is the previous conversation history: {history}. "
        f"Below is the content from the uploaded document: {text}. "
        "Now continue the conversation directly with a response to the user's prompt."
    )

    # Step 2: Getting a specific reply to the user's prompt
    response2 = chat.send_message(
        f"Based on the context provided above, generate a concise response to the user's prompt: '{prompt}'. "
        "Only provide the bot's reply without any additional formatting or object structures."
    )
    reply = response2.text
    return reply


@app.route('/summarize', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            article = extract_text_from_pdf(file)
            summary = RegularizeText(summarize_article(article))

            further_summary = RegularizeText(further_summarize(article))
            # return render_template('index.html', original_summary=summary, further_summary=further_summary_html)
            return jsonify({
                "text": article,
                'original_summary': summary,
                'further_summary': further_summary
            })

@app.route('/chat', methods=['POST'])
def chat():
    if request.method == 'POST':
        data = request.json
        text = data.get('summ')
        history = data.get('chatData', [])
        prompt = data.get('message')
        print(data)
        reply = chatc(text, history, prompt)    
        # Return the response
        return jsonify({'response': reply})


if __name__ == '__main__':
    import os
    HOST = os.environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(os.environ.get('SERVER_PORT', '5000'))
    except ValueError:
        PORT = 5000
    app.run(HOST, PORT)
