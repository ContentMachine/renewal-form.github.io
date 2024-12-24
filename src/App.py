from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)  # Allow requests from your React app

# Database connection
def get_db_connection():
    return pymysql.connect(
        host='localhost:3306',                  # Database host
        user='insurealltheway_mainuser',# Database username
        password='nCSZ92g%_JlG8zZW',           # Database password
        database='insurealltheway_main1', # Database name
        cursorclass=pymysql.cursors.DictCursor
    )

# Route to fetch vehicle data by number plate
@app.route('/api/vehicle/fetch', methods=['GET'])
def fetch_vehicle():
    number_plate = request.args.get('number_plate')
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "SELECT * FROM vehicles WHERE number_plate = %s"
        cursor.execute(sql, (number_plate,))
        result = cursor.fetchone()
        if result:
            return jsonify(result), 200
        return jsonify({"message": "No data found"}), 404
    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()  # Close the cursor only if it was successfully initialized
        if conn:
            conn.close()    # Close the connection if it was successfully initialized


# Route to submit vehicle form data
@app.route('/api/vehicle/submit', methods=['POST'])
def submit_vehicle():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = """
            INSERT INTO vehicles (number_plate, owner_name, owner_email, owner_phone, registration_date,
                                  vehicle_make, vehicle_model, vehicle_year, chassis_number, engine_number,
                                  insurance_type, license_expiration_date, roadworthiness_expiration_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            data['number_plate'], data['owner_name'], data['owner_email'], data['owner_phone'],
            data['registration_date'], data['vehicle_make'], data['vehicle_model'], data['vehicle_year'],
            data['chassis_number'], data['engine_number'], data['insurance_type'],
            data['license_expiration_date'], data['roadworthiness_expiration_date']
        ))
        conn.commit()
        return jsonify({"message": "Data inserted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
