import mysql.connector

class DataManage:
    def fetchSpecific(self,field,value,table):
        adm = []
        query = f"select * from {table} where {field} = {value}"
        cursor = self.getCursor()
        cursor.execute(query)
        ans = cursor.fetchall()
        return len(ans)



    def fetchAllAdmin(self):
        adm = []
        query = "select * from admin"
        cursor = self.getCursor()
        cursor.execute(query)
        ans = cursor.fetchall()
        for data in ans:
            adm.append({
                "id" : data[0],
                "reg_no" : data[1],
                "name" : data[2],
                "email" : data[3],
                "password" : data[4]
            })
        return adm



    def insertInAdmin(self,val):
        cursor = self.getCursor()
        query = f"insert into admin (reg_no,name,email,password) value('{val["reg_no"]}','{val["name"]}','{val["email"]}','{val["password"]}')"
        cursor.execute(query)
        self.dataBase.commit()

    
    def insertInPatient(self,val):
        cursor = self.getCursor()
        query = f"insert into patient (name,email,phone,password) value('{val["name"]}','{val["email"]}','{val["phone"]}','{val["password"]}')"
        cursor.execute(query)
        self.dataBase.commit()

    def getCursor(self):
        return self.dataBase.cursor()

    def __init__(self):
        self.dataBase = mysql.connector.connect(host ="localhost",
                                            user ="root",
                                            passwd ="",
                                            database = "jeevanscan")



