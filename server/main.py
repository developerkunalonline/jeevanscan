from flask import Flask,request,session,jsonify
import mysql.connector
import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app,supports_credentials=True)
app.secret_key = "scanjeevan"

#session['isLogged'] = False




def set_session(data,rol):
    session['isLogged'] = True
    session['role'] : rol
    session['data'] = data


@app.route('/get-session')
def get_session():
    
    if session.get('isLogged') ==None:
        return jsonify({'response':{'status':'failed','message':'session not created'}})
    return jsonify({'response':{'status':'success','message':'session created'},'result': session['data']})

@app.route('/admin-login', methods = ['POST'])
def adminLogin():
    if request.method =='POST':
        response = {
            "reg_no" : request.json.get("reg_no"),
            "password" : request.json.get("password")
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
            set_session(ans['response'],rol='admin')

            return ans
    return {"message":"not a post request"}



@app.route('/patient-login', methods = ['POST'])
def patientLogin():
    if request.method =='POST':
        print(request.json)
        response = {
            "phone" : request.json.get("phone"),
            "password" : request.json.get("password")
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
            set_session(ans['response'],rol='patient')
            return ans
    return {"message":"not a post request"}


@app.route('/admin-signup',methods=['POST'])
def admin_signup():

    if request.method == 'POST':
        response = {
                "reg_no" : request.json.get('registration'),
                "name" : request.json.get('name'),
                "email" : request.json.get('email'),
                "password" : request.json.get('password')
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
                
                "name" : request.json.get('name'),
                "email" : request.json.get('email'),
                "phone" : request.json.get('registration'),
                "password" : request.json.get('password')
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


@app.route('/logout')
def logout():
    session.clear()
    return jsonify({"status":"success","message":"session cleared successfully"})


if __name__ == '__main__':
    app.run(port=3456, host='0.0.0.0',debug=True)