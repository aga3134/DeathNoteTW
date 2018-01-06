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


if __name__ == "__main__":
    config = json.loads(open("config.json").read())
    auth = config["mysqlAuth"]
    connection = pymysql.connect(host=auth["host"],user=auth["username"],
            password=auth["password"],db=auth["dbName"],
            charset='utf8',cursorclass=pymysql.cursors.DictCursor)
    
    dataBirth = DataBirth(connection)
    
    #ignore warning message
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', pymysql.Warning)
        args = sys.argv
        if "init" in args:
            dataBirth.CreateTable()
        if "birth" in args:
            dataBirth.UpdateData()
   
    
    connection.close()