# -*- coding: utf-8 -*-
"""
Created on Wed Dec 27 17:51:26 2017

@author: aga
"""

import sys
import json
import pymysql
import warnings
from DataBirth import DataBirth
from DataAging import DataAging
from DataDisease import DataDisease
from DataDeath import DataDeath

if __name__ == "__main__":
    config = json.loads(open("config.json").read())
    auth = config["mysqlAuth"]
    connection = pymysql.connect(host=auth["host"],user=auth["username"],
            password=auth["password"],db=auth["dbName"],
            charset='utf8',cursorclass=pymysql.cursors.DictCursor)
    
    dataBirth = DataBirth(connection)
    dataAging = DataAging(connection)
    dataDisease = DataDisease(connection)
    dataDeath = DataDeath(connection)
    
    #ignore warning message
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', pymysql.Warning)
        args = sys.argv
        if "init" in args:
            dataBirth.CreateTable()
            dataAging.CreateTable()
            dataDisease.CreateTable()
            dataDeath.CreateTable()
        if "birth" in args:
            dataBirth.UpdateData()
        if "aging" in args:
            dataAging.UpdateData()
        if "disease" in args:
            dataDisease.UpdateData()
        if "death" in args:
            dataDeath.UpdateData()
   
    
    connection.close()