# -*- coding: utf-8 -*-
"""
Created on Mon Oct 23 12:10:08 2017

@author: aga
"""

def GenValue(record, keyStr):
    val = ""
    arr = keyStr.split(",")
    
    n = len(arr)
    for i in range(0,n):
        key = arr[i].strip()
        value = record[key]
        #字串
        if isinstance(value,str):
            val+="'"+value+"'"
        else:   #數字
            val+=str(value)
        if i < n-1:
            val+=","
    return val

def IsNumber(s):
    if s is None:
        return False
    try:
        float(s)
        return True
    except ValueError:
        return False
    
def VarifyValue(value):
    if IsNumber(value):    
        return value
    else:
        return 0

def DataToDB(connection, table, d):
    field = ",".join(d.keys())
    val = GenValue(d,field)
    with connection.cursor() as cursor:
        sql = "INSERT IGNORE INTO "+table+" ("+field+") VALUES ("+val+")"
        #print(sql)
        cursor.execute(sql)
        