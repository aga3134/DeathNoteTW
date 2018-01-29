# -*- coding: utf-8 -*-
"""
Created on Wed Dec 27 17:51:03 2017

@author: aga
"""

import Util as util
import json
import re

class DataDeath:
    def __init__(self, connection):
        self.connection = connection
        self.deathCode = json.loads(open("deathCode.json",encoding="utf8").read())

    def CreateTable(self):
        print("Create Table for DataDeath")
        with self.connection.cursor() as cursor:
            sql = "CREATE TABLE IF NOT EXISTS DeathGeneral (\
                year INT(11),\
                county VARCHAR(255),\
                cause VARCHAR(255),\
                ageCode VARCHAR(10),\
                minAge Float,\
                maxAge Float,\
                sex VARCHAR(10),\
                count INT(11),\
                PRIMARY KEY (sex,county,cause,ageCode,year)\
                );"
            cursor.execute(sql)
            
            sql = "CREATE TABLE IF NOT EXISTS DeathCancer (\
                year INT(11),\
                county VARCHAR(255),\
                cause VARCHAR(255),\
                ageCode VARCHAR(10),\
                minAge Float,\
                maxAge Float,\
                sex VARCHAR(10),\
                count INT(11),\
                PRIMARY KEY (sex,county,cause,ageCode,year)\
                );"
            cursor.execute(sql)
            
            sql = "CREATE TABLE IF NOT EXISTS DeathGeneralSum (\
                year INT(11),\
                county VARCHAR(255),\
                sex VARCHAR(10),\
                count INT(11),\
                PRIMARY KEY (year,county,sex)\
                );"
            cursor.execute(sql)
            
            sql = "CREATE TABLE IF NOT EXISTS DeathCancerSum (\
                year INT(11),\
                county VARCHAR(255),\
                sex VARCHAR(10),\
                count INT(11),\
                PRIMARY KEY (year,county,sex)\
                );"
            cursor.execute(sql)

        self.connection.commit()
        
    def GetCountyCode(self,year):
        if year <= 2003:
            countyCode = self.deathCode["county"]["1990~2003年"];
        elif year <= 2007:
            countyCode = self.deathCode["county"]["2004~2007年"];
        elif year <= 2010:
            countyCode = self.deathCode["county"]["2008~2010年"];
        elif year <= 2013:
            countyCode = self.deathCode["county"]["2011~2013年"];
        else:
            countyCode = self.deathCode["county"]["2014年~"];
        return countyCode;
    
    def GetCauseCode(self,year,causeType):
        if causeType == "general":
            if year <= 2007:
                causeCode = self.deathCode["causeGeneral"]["2007(含)以前"];
            else:
                causeCode = self.deathCode["causeGeneral"]["2008年以後"];
        elif causeType == "cancer":
            if year <= 2007:
                causeCode = self.deathCode["causeCancer"]["2007(含)以前"];
            else:
                causeCode = self.deathCode["causeCancer"]["2008年以後"];
        return causeCode;
    
    def GetMinMaxAge(self,ageCode):
        if ageCode == "01":
            minAge = 0
            maxAge = 0.33
        elif ageCode == "02":
            minAge = 0.33
            maxAge = 1
        elif ageCode == "03":
            minAge = 1
            maxAge = 2
        elif ageCode == "04":
            minAge = 2
            maxAge = 3
        elif ageCode == "05":
            minAge = 3
            maxAge = 4
        elif ageCode == "06":
            minAge = 3
            maxAge = 4
        elif ageCode == "26":
            minAge = 100
            maxAge = 100
        elif ageCode == "99":
            minAge = -1
            maxAge = -1
        else:
            age = re.findall(r"\d+",self.deathCode["ageCode"][ageCode])
            minAge = age[0]
            maxAge = age[1]
        return [minAge,maxAge]
        
    def UpdateDeathTable(self,path,causeType,deathTable,sumTable):
        #clear database record
        with self.connection.cursor() as cursor:
            sql = "DELETE FROM "+deathTable+" WHERE year>=0"
            cursor.execute(sql)
            sql = "DELETE FROM "+sumTable+" WHERE year>=0"
            cursor.execute(sql)
        self.connection.commit()
                        
        sexArr = {"1":"男","2":"女"}
        for y in range(81,106):
            print(y)
            countyCode = self.GetCountyCode(y+1911)
            causeCode = self.GetCauseCode(y+1911,causeType)
            
            filename = path+str(y)+".csv"
            with open(filename) as f:
                f.readline() #skip header
                for line in f:
                    row = f.readline().strip().split(",")
                    if row[0] == "":
                        continue
                    d = {}
                    d["year"] = int(row[0])+1911
                    if(row[1] not in countyCode):
                        continue
                    d["county"] = countyCode[row[1]]
                    if(row[2] not in causeCode):
                        continue
                    d["cause"] = causeCode[row[2]]
                    d["ageCode"] = row[4]
                    ageArr = self.GetMinMaxAge(row[4])
                    d["minAge"] = ageArr[0]
                    d["maxAge"] = ageArr[1]
                    d["sex"] = sexArr[row[3]]
                    d["count"] = int(row[5])
                    #print(d)
                    #util.DataToDB(self.connection,deathTable,d)
                    
                    #縣市總計
                    with self.connection.cursor() as cursor:
                        keyArr = "year,county,cause,ageCode,minAge,maxAge,sex,count"
                        d["county"] = countyCode[row[1][:2]]
                        val = util.GenValue(d,keyArr)
                        sql = "INSERT INTO "+deathTable+" (year,county,cause,ageCode,minAge,maxAge,sex,count) VALUES ("+val+") ON DUPLICATE KEY UPDATE count=count+"+str(d["count"])
                        #print(sql)
                        cursor.execute(sql)
                    
                    #全台總計
                    with self.connection.cursor() as cursor:
                        keyArr = "year,county,cause,ageCode,minAge,maxAge,sex,count"
                        d["county"] = "總計"
                        val = util.GenValue(d,keyArr)
                        sql = "INSERT INTO "+deathTable+" (year,county,cause,ageCode,minAge,maxAge,sex,count) VALUES ("+val+") ON DUPLICATE KEY UPDATE count=count+"+str(d["count"])
                        #print(sql)
                        cursor.execute(sql)
                        
                    #人數總計
                    with self.connection.cursor() as cursor:
                        keyArr = "year,county,sex,count"
                        d["county"] = countyCode[row[1][:2]]
                        val = util.GenValue(d,keyArr)
                        sql = "INSERT INTO "+sumTable+" (year,county,sex,count) VALUES ("+val+") ON DUPLICATE KEY UPDATE count=count+"+str(d["count"])
                        #print(sql)
                        cursor.execute(sql)
                        
                    #男女合計 縣市
                    with self.connection.cursor() as cursor:
                        keyArr = "year,county,cause,ageCode,minAge,maxAge,sex,count"
                        d["county"] = countyCode[row[1][:2]]
                        d["sex"] = "全部"
                        val = util.GenValue(d,keyArr)
                        sql = "INSERT INTO "+deathTable+" (year,county,cause,ageCode,minAge,maxAge,sex,count) VALUES ("+val+") ON DUPLICATE KEY UPDATE count=count+"+str(d["count"])
                        #print(sql)
                        cursor.execute(sql)
                        
                    #男女合計 全台
                    with self.connection.cursor() as cursor:
                        keyArr = "year,county,cause,ageCode,minAge,maxAge,sex,count"
                        d["county"] = "總計"
                        d["sex"] = "全部"
                        val = util.GenValue(d,keyArr)
                        sql = "INSERT INTO "+deathTable+" (year,county,cause,ageCode,minAge,maxAge,sex,count) VALUES ("+val+") ON DUPLICATE KEY UPDATE count=count+"+str(d["count"])
                        #print(sql)
                        cursor.execute(sql)
                        
                    #男女合計 人數總計
                    with self.connection.cursor() as cursor:
                        keyArr = "year,county,sex,count"
                        d["county"] = countyCode[row[1][:2]]
                        d["sex"] = "全部"
                        val = util.GenValue(d,keyArr)
                        sql = "INSERT INTO "+sumTable+" (year,county,sex,count) VALUES ("+val+") ON DUPLICATE KEY UPDATE count=count+"+str(d["count"])
                        #print(sql)
                        cursor.execute(sql)
                    
            self.connection.commit()
        
    def UpdateData(self):
        #print("update DeathGeneral")
        #self.UpdateDeathTable("data/死之章/死因統計/dead","general","DeathGeneral","DeathGeneralSum")
        print("update DeathCancer")
        self.UpdateDeathTable("data/死之章/癌症死因統計/cancer","cancer","DeathCancer","DeathCancerSum")
        
      