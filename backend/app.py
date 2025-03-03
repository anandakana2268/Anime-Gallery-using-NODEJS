from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

# Set a secret key for session management
app.secret_key = 'anandakana2268tell2harshi5679abfcaedmmr-===?'

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',       
        user='root',             
        password='2268@Anand',             
        database='anime_gallery'  # Assuming 'anime_gallery' as your database name
    )

# Route to handle review submission
@app.route('/submit_review', methods=['POST'])
def submit_review():
    try:
        # Get the data from the request
        data = request.get_json()
        username = data['username']
        anime_name = data['anime_name']
        category = data['category']
        review_comment = data['review_comment']
        
        # Establish DB connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert review into database
        cursor.execute("""
            INSERT INTO reviews (username, anime_name, category, review_comment)
            VALUES (%s, %s, %s, %s)
        """, (username, anime_name, category, review_comment))
        
        # Commit and close the connection
        conn.commit() 
        cursor.close()
        conn.close()

        # Return success response
        return jsonify({'message': 'Review submitted successfully!'}), 200

    except Error as e:
        # Return error response
        return jsonify({'error': str(e)}), 500

# Route to fetch all reviews
@app.route('/reviews', methods=['GET'])
def get_reviews():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)  

        # Get all reviews from the database
        cursor.execute("SELECT * FROM reviews ORDER BY created_at DESC")
        reviews = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'reviews': reviews}), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

# Route to render the review page
@app.route('/reviews_page', methods=['GET'])
def reviews_page():
    # Assuming 'username' is saved in session after login
    username = session.get('username', 'Guest')
    
    # Fetch reviews from the database to display on the page
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)  
    cursor.execute("SELECT * FROM reviews ORDER BY created_at DESC")
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('user-dashboard.html', reviews=reviews, username=username)

if __name__ == '__main__':
    app.run(debug=True)
