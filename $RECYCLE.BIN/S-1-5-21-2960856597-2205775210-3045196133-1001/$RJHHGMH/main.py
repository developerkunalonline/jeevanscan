from flask import Flask,request,session
import mysql.connector
import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route('/admin-login', methods = ['POST'])
def adminLogin():
    if request.method =='POST':
        response = {
            "reg_no" : request.values.get("reg_no"),
            "password" : request.values.get("password")
        }
        print("I am in main ",response)
        myDb = db.DataManage()
        query = f"SELECT * FROM admin WHERE reg_no = '{response['reg_no']}' AND password = '{response['password']}';"
        
        cursor = myDb.getCursor()
        cursor.execute(query)
        data = cursor.fetchall()
        print(data)
        if len(data) == 0:
            return {"result":{"status" : "failed","message":"invalid username or password"}}
        else:
            ans = {
                "result":{"status" : "success","message":"fetched data"},

                "response":{"id" : data[0][0],
                "reg_no" : data[0][1],
                "name" : data[0][2],
                "email" : data[0][3],
                "password" : data[0][4]
                }
            
           }
            return ans
    return {"message":"not a post request"}


@app.route('/patient-login', methods = ['POST'])
def patientLogin():
    if request.method =='POST':
        response = {
            "phone" : request.values.get("phone"),
            "password" : request.values.get("password")
        }
        print("I am in main ",response)
        myDb = db.DataManage()
        query = f"SELECT * FROM patient WHERE phone = '{response['phone']}' AND password = '{response['password']}';"
        
        cursor = myDb.getCursor()
        cursor.execute(query)
        data = cursor.fetchall()
        print(data)
        if len(data) == 0:
            return {"result":{"status" : "failed","message":"invalid username or password"}}
        else:
            ans = {
                "result":{"status" : "success","message":"fetched data"},

                "response":{"id" : data[0][0],
                "name" : data[0][1],
                "phone" : data[0][2],
                "email" : data[0][3],
                "password" : data[0][4]
                }
            
           }
            return ans
    return {"message":"not a post request"}


@app.route('/admin-signup',methods=['POST'])
def admin_signup():

    if request.method == 'POST':
        response = {
                "reg_no" : request.values.get('reg_no'),
                "name" : request.values.get('name'),
                "email" : request.values.get('email'),
                "password" : request.values.get('password')
            }
        
        myDb = db.DataManage()
        if(myDb.fetchSpecific("reg_no",response['reg_no'],"admin")== 0):
            myDb.insertInAdmin(response)        
            return [{"status":"success","message":"record added sucessfully"},response]
        return{
        "status": "failed",
        "message" : "Admin already exist"
    }
    
    return {
        "status": "failed",
        "message" : "can't send post"
    }

@app.route('/patient-signup',methods=['POST'])
def patient_signup():

    if request.method == 'POST':
        response = {
                
                "name" : request.values.get('name'),
                "email" : request.values.get('email'),
                "phone" : request.values.get('phone'),
                "password" : request.values.get('password')
            }
        myDb = db.DataManage()
        if(myDb.fetchSpecific("phone",response['phone'],"patient")== 0):
            myDb.insertInPatient(response)        
            return [{"status":"success","message":"record added sucessfully"},response]
        return{
        "status": "failed",
        "message" : "user already exist"
    }
    return {
        "status": "failed",
        "message" : "can't send post"
    }


if __name__ == '__main__':
    app.run(port=3456, host='0.0.0.0',debug=True)