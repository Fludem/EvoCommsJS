# TimyAI Device Communication Protocol

## Introduction

This document describes the communication protocol between a TimyAI clocking machine (terminal) and the server. The protocol enables data exchange for operations such as user management, log retrieval, and device configuration.

### System Architecture

The system involves the following components:

- **TimyAI Terminal (Clocking Machine):** A device made by TimyAI used for clocking in/out, user authentication, and other related functions.
- **Server:** A system that manages user data, logs, device configuration, and communicates with the terminals.

The terminal actively sends data to the server, and the server actively pushes messages to the terminal. The communication flow is bi-directional.

### Connection Basics

- Protocol: WebSocket [RFC6455 13](https://datatracker.ietf.org/doc/html/rfc6455).
   - Default port: 7788
   - Encryption: TLS. Off by default.
- Data Format: JSON.
- Key-Value Case: Lowercase.
- Character Encoding: UTF-8 for names and Chinese characters.

#### Connection Initialisation

Network communication is done using websockets. It starts when a Terminal initiates a WebSocket connection with the server, which listens for these connections on port 7788 by default. 

The terminal sends a 'reg' command when the connection is established, which allows the server to identify the terminal.

#### Communication Flow

Although websockets don't require messages to be sent in a [request -> | <- response] pattern, the timy devices adopt this flow.

This means that when a message(request) is sent, it's expected that the receiver will respond(reply) with an appropriate response. For example, the terminal may send a new clocking to the server. The terminal expects a response back from the server indicating whether or not it received the data or potentially rejected the data.

Both the terminal and the server can send requests in the websocket session. However, the requests sent by the terminal are not the same types of requests the server might send.

## Terminal-Initiated Messages

The terminal only sends messages to give data to the server. The server can also send messages, but these messages are commands that result in the terminal performing an action.

### 1\. Register

The terminal sends this message to identify itself to the server.

#### Request

```json
{  
 "cmd": "reg",  
 "sn": "ZX0006827500", // Terminal serial number (unique, fixed by manufacturer)  
 "cpusn": "123456789", // CPU serial number (fixed)  
 "devinfo": {  
 "modelname": "tfs30",  
 "usersize": 3000, // User capacity (e.g., 1000/3000/5000)  
 "fpsize": 3000, // Fingerprint capacity (e.g., 1000/3000/5000)  
 "cardsize": 3000, // RFID card capacity (e.g., 1000/3000/5000/10000)  
 "pwdsize": 3000, // Password capacity  
 "logsize": 100000, // Clocking Record Capacity  
 "useduser": 1000,  
 "usedfp": 1000,  
 "usedcard": 2000,  
 "usedpwd": 400,  
 "usedlog": 100000,  
 "usednewlog": 5000,  
 "fpalgo": "thbio3.0", // Fingerprint algorithm (thbio1.0 or thbio3.0)  
 "firmware": "th600w v6.1", // Terminal firmware version  
 "time": "2016-03-25 13:49:30", // The current date and time set on the terminal
 "mac": "00-01-A9-01-00-01"
 }  
}
``````

#### Response

- **Success:**  

```json
  {  
   "ret": "reg",  
   "result": true,  
   "cloudtime": "2016-03-25 13:49:30", // Server current time  
   "nosenduser": true // When enabled the terminal will automatically send users to the server when they are added.
  }
```
- **Failure:**  

```json
  {  
   "ret": "reg",  
   "result": false,  
   "reason": "did not reg" // Message to display on the terminal screen  
  }
```
### 2\. Send Logs (sendlog)

The terminal sends this message to transmit user logs (clocking data) to the server.

#### Request

```json
{  
 "cmd": "sendlog",  
 "sn": "zx12345678",  
 "count": 2, // Number of log records  
 "logindex": 10, // Used to confirm that the data the server has is in sync with the terminals data
 "record": [  
 {  
 "enrollid": 1,  
 "time": "2016-03-25 13:49:30",  
 "mode": 0, // 0: Fingerprint, 1: Card, 2: Password, 8: Face  
 "inout": 0, // 0: In, 1: Out (Master/Child machine)  
 "event": 0, // 0: Normal. F1-F4 key presses (customizable)  
 "temp": 36.5, // Body Temp
 "verifymode": 13, // QR code Verify
 "image": "gesg524hgd" // Real-time punch image (Base64 encoded)  
 },  
 {  
 "enrollid": 2,  
 "time": "2016-03-25 13:49:30",  
 "mode": 0,  
 "inout": 0,  
 "event": 1,  
 "verifymode": 13,  
 "temp": 36.5,  
 "image": "gesg524hgd"  
 }  
 ]  
}
```

#### Response

- **Success:**  

```json
  {  
   "ret": "sendlog",  
   "result": true,  
   "count": 2,  
   "logindex": 10, // To confirm the server's data is in sync with the terminals 
   "cloudtime": "2016-03-25 13:49:30", // The terminal will change it's time to this value to prevent time being outof sync and incase of changes like day light saving.
   "access": 1, // 1: Open door, 0: Do not open (external function)  
   "message": "message" // Device interface information (when AI face is Server mode)  
  }
```
- **Failure:**  

```json
  {  
   "ret": "sendlog",  
   "result": false,  
   "reason": 1  
  }
```


> [!NOTE]  
> Please see below for details on valid values of ambigious keys:
 
```
- enrollid \!= 0:
  - mode: 0 \= Fingerprint, 1 \= Card, 2 \= Password
  - inout: 0 \= In (Master Machine), 1 \= Out (Child Machine)
  - event: 0-16 \= Customizable events (with software, F1-F4 keys)
- enrollid \= 0:
  - mode: 0
  - inout: 1
  - event: Door status or event:
    - UI_MGLOG_CLOSED
    - UI_MGLOG_OPENED
    - UI_MGLOG_HAND_OPEN (Exit button)
    - UI_MGLOG_PROG_OPEN (Software open)
    - UI_MGLOG_PROG_CLOSE (Software close)
    - UI_MGLOG_ILLEGAL_OPEN
    - UI_MGLOG_ILLEGAL_REMOVE
    - UI_MGLOG_ALARM (Input alarm)
- verifymode: 13 \= QR code verification
```

### 3\. Send User Information (senduser)

The terminal sends this message to transmit new user information to the server (e.g., when a user is added via the keypad). This happens when the serer replied with 'senduser' as true/enabled.

#### Fingerprint Request

```json
{  
 "cmd": "senduser",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 0, // 0-9: Fingerprint, 20-27: Static Face, 30-37: PARLM, 50: Photo  
 "admin": 0, // 0: Normal user, 1: Administrator, 2: Super User  
 "record": "kajgksjgaglas" // Fingerprint data (string, \<1620 for THbio3.0, \<1024 for THbio1.0)  
}
```
#### RFID Card Request

```json
{  
 "cmd": "senduser",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 11,  
 "admin": 0,  
 "record": 2352253 // RFID card data  
}
```
#### Password Request

```json
{  
 "cmd": "senduser",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 10,  
 "admin": 0,  
 "record": 12345678 // Password (max 8 digits)  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "senduser",  
   "result": true,  
   "cloudtime": "2016-03-25 13:49:30"  
  }
```
- **Failure:**  

```json
  {  
   "ret": "senduser",  
   "result": false,  
   "reason": 1  
  }
```
## Server-Initiated Messages

The server typically sends messages that could be called 'commands'. The terminal on the other-hand only sends data to the server. 

### 1\. Get User List (getuserlist)

The server sends this message to retrieve a list of users from the terminal. The terminal may need to send multiple responses if the user list is large.

#### Request

```json
{  
 "cmd": "getuserlist",  
 "stn": true // true for first request, false for subsequent responses  
}
```
#### Response

- **Success:** (Example \- first response)  

```json
  {  
   "ret": "getuserlist",  
   "result": true,  
   "count": 40, // Number of records in this package (\<= 40\)  
   "from": 0, // Starting index  
   "to": 39, // Ending index  
   "record": [  
   {  
   "enrollid": 1,  
   "admin": 0, // 0: Normal, 1: Admin, 2: Super User  
   "backupnum": 0 // 0-9: FP, 10: Password, 11: RFID, 20-27: Static Face, 30-37: PARLM, 50: Photo  
   },  
   {  
   "enrollid": 2,  
   "admin": 1,  
   "backupnum": 0  
   },  
   {  
   "enrollid": 3,  
   "admin": 0,  
   "backupnum": 10  
   }  
   ]  
  }
```

- **Server's Second Request**  

```json
  {  
   "cmd": "getuserlist",  
   "stn": false // Should be false for subsequent requests  
  }
```
- **Terminal's Second Response**  

```json
  {  
   "ret": "getuserlist",  
   "result": true,  
   "count": 40,  
   "from": 40,  
   "to": 79,  
   "record": [  
   // ... next 40 records  
   ]  
  }
```
- **Success (Empty User List):**  

```json
  {  
   "ret": "getuserlist",  
   "result": true,  
   "count": 0,  
   "from": 0,  
   "to": 0,  
   "record": []  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getuserlist",  
   "result": false,  
   "reason": 1  
  }
```
### 2\. Get User Information (getuserinfo)

The server sends this message to retrieve detailed information for a specific user.

#### Fingerprint Request

```json
{  
 "cmd": "getuserinfo",  
 "enrollid": 1,  
 "backupnum": 0  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": true,  
   "enrollid": 1,  
   "name": "chingzou",  
   "backupnum": 0,  
   "admin": 0,  
   "record": "aabbccddeeffggddssiifdjdkjfkjdsjlkjal" // Fingerprint data  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": false,  
   "reason": 1  
  }
```
#### Photo Request

```json
{  
 "cmd": "getuserinfo",  
 "enrollid": 1,  
 "backupnum": 50  
}
```
#### Photo Response

- **Success:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": true,  
   "enrollid": 1,  
   "name": "chingzou",  
   "backupnum": 50,  
   "admin": 0,  
   "record": "aabbccddeeffggddssiifdjdkjfkjdsjlkjal" // Base64 Photo  
  }
```
#### RFID Card Request

```json
{  
 "cmd": "getuserinfo",  
 "enrollid": 1,  
 "backupnum": 11  
}
```
#### RFID Card Response

- **Success:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": true,  
   "enrollid": 1,  
   "name": "chingzou",  
   "backupnum": 11,  
   "admin": 0,  
   "record": 23532253 // RFID Card Data  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": false,  
   "reason": 1  
  }
```
#### Password Request

```json
{  
 "cmd": "getuserinfo",  
 "enrollid": 1,  
 "backupnum": 10  
}
```
#### Password Response

- **Success:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": true,  
   "enrollid": 1,  
   "name": "chingzou",  
   "backupnum": 10,  
   "admin": 0,  
   "record": 23532253 // Password  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getuserinfo",  
   "result": false,  
   "reason": 1  
  }
```
### 3\. Set User Information (setuserinfo)

The server sends this message to add or modify user information on the terminal.

#### Fingerprint Request

```json
{  
 "cmd": "setuserinfo",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 0,  
 "admin": 0,  
 "record": "aabbccddeeffggddssiifdjdkjfkjdsjlkjalflsgsadg" // Fingerprint Data  
}
```
#### Photo Request

```json
{  
 "cmd": "setuserinfo",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 50,  
 "admin": 0,  
 "record": "aabbccddeeffggddssiifdjdkjfkjdsjlkjalflsgsadg" // Base64 Photo  
}
```

#### Password Request

```json
{  
 "cmd": "setuserinfo",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 10,  
 "admin": 0,  
 "record": 12345678 // Password  
}
```

#### RFID Card Request

```json
{  
 "cmd": "setuserinfo",  
 "enrollid": 1,  
 "name": "chingzou",  
 "backupnum": 11,  
 "admin": 0,  
 "record": 2352253 // RFID Card Data  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "setuserinfo",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setuserinfo",  
   "result": false,  
   "reason": 1  
  }
```
### 4\. Delete User Information (deleteuser)

The server sends this message to delete user information from the terminal.

#### Request

```json
{  
 "cmd": "deleteuser",  
 "enrollid": 1,  
 "backupnum": 0 // 0-9: Fingerprint, 10: Password, 11: Card, 12: All fingerprints, 13: All user data  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "deleteuser",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "deleteuser",  
   "result": false,  
   "reason": 1  
  }
```
### 5\. Get User Name (getusername)

The server sends this message to get user name.

#### Request

```json
{  
 "cmd":"getusername",  
 "enrollid":1  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"getusername",  
   "result":true,  
   "record":"chingzou" // UTF8 or ASCII  
  }
```
- **Failure:**  

```json
  {  
   "ret":"getusername",  
   "result":false,  
   "reason":1  
  }
```
### 6\. Set User Name (setusername)

The server sends this message to set user name.

#### Request

```json
{  
 "cmd":"setusername",  
 "count":50, // must less than 50 records per package  
 "record":[  
 {  
 "enrollid":1,  
 "name":"chingzou"  
 },  
 {  
 "enrollid":2,  
 "name":"chingzou2"  
 }  
 ]  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"setusername",  
   "result":true  
  }
```
- **Failure:**  

```json
  {  
   "ret":"setusername",  
   "result":false,  
   "reason":1  
  }
```
### 7\. Enable User (enableuser)

Server send message to enable user.

#### Request

```json
{  
 "cmd":"enableuser",  
 "enrollid":1,  
 "enflag":1  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"enableuser",  
   "result":true  
  }
```
- **Failure:**  

```json
  {  
   "ret":"enableuser",  
   "result":false,  
   "reason":1  
  }
```
### 8\. Disable User (disableuser)

Server sends message to disable user.

#### Request

```json
{  
 "cmd":"enableuser",  
 "enrollid":1,  
 "enflag":0  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"enableuser",  
   "result":true  
  }
```
- **Failure:**  

```json
  {  
   "ret":"enableuser",  
   "result":false,  
   "reason":1  
  }
```
### 9\. Clean All Users (cleanuser)

The server sends this message to delete all users from the terminal.

#### Request

```json
{  
 "cmd": "cleanuser"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "cleanuser",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "cleanuser",  
   "result": false,  
   "reason": 1  
  }
```
### 10\. Get New Logs (getnewlog)

Server requests new logs from the terminal

#### Request

```json
{  
 "cmd":"getnewlog",  
 "stn":true  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"getnewlog",  
   "result":true,  
   "count":1000,  
   "from":0,  
   "to":49,  
   "record":[  
   {  
   "enrollid":1,  
   "time":"2016-03-25 13:49:30",  
   "mode":0, // 0:fp 1:card 2:pwd  
   "inout":0, // 0:in 1:out  
   "event":0  
   },  
   {  
   "enrollid":2,  
   "time":"2016-03-25 13:49:30",  
   "mode":0,  
   "inout":0,  
   "event":1  
   }  
   ]  
  }
```
- **Server's second request**  

```json
  {  
   "cmd":"getnewlog",  
   "stn":false  
  }
```
- **Terminal's Second Response**  

```json
  {  
   "ret":"getnewlog",  
   "result":true,  
   "count":1000,  
   "from":50,  
   "to":99,  
   "record":[  
   {  
   "enrollid":111,  
   "time":"2016-03-25 13:49:30",  
   "mode":0, // 0:fp 1:card 2:pwd  
   "inout":0, // 0:in 1:out  
   "event":0  
   },  
   {  
   "enrollid":112,  
   "time":"2016-03-25 13:49:30",  
   "mode":0,  
   "inout":0,  
   "event":1  
   }  
   ]  
  }
```
- **Success (No new logs):**  

```json
  {  
   "ret": "getnewlog",  
   "result": true,  
   "count": 0,  
   "from": 0,  
   "to": 0,  
   "record": []  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getnewlog",  
   "result": false,  
   "reason": 1  
  }
```
### 11\. Get All Logs (getalllog)

Server requests all logs from the terminal

#### Request

```json
{  
 "cmd":"getalllog",  
 "stn":true,  
 "from":"2018-11-1", // optional from date  
 "to":"2018-12-30" // optional to date  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"getalllog",  
   "result":true,  
   "count":1000,  
   "from":0,  
   "to":49,  
   "record":[  
   {  
   "enrollid":1,  
   "time":"2016-03-25 13:49:30",  
   "mode":0, // 0:fp 1:card 2:pwd  
   "inout":0, // 0:in 1:out  
   "event":0  
   },  
   {  
   "enrollid":2,  
   "time":"2016-03-25 13:49:30",  
   "mode":0,  
   "inout":0,  
   "event":1  
   }  
   ]  
  }
```
- **Server's second request**  

```json
  {  
   "cmd":"getalllog",  
   "stn":false  
  }
```
- **Terminal's Second Response**  

```json
  {  
   "ret":"getalllog",  
   "result":true,  
   "count":1000,  
   "from":50,  
   "to":99,  
   "record":[  
   {  
   "enrollid":111,  
   "time":"2016-03-25 13:49:30",  
   "mode":0, // 0:fp 1:card 2:pwd  
   "inout":0, // 0:in 1:out  
   "event":0  
   },  
   {  
   "enrollid":112,  
   "time":"2016-03-25 13:49:30",  
   "mode":0,  
   "inout":0,  
   "event":1  
   }  
   ]  
  }
```
- **Success (No logs):**  

```json
  {  
   "ret": "getalllog",  
   "result": true,  
   "count": 0,  
   "from": 0,  
   "to": 0,  
   "record": []  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getalllog",  
   "result": false,  
   "reason": 1  
  }
```
### 12\. Clean All Logs (cleanlog)

The server sends this message to delete all logs from the terminal.

#### Request

```json
{  
 "cmd": "cleanlog"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "cleanlog",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "cleanlog",  
   "result": false,  
   "reason": 1  
  }
```
### 13\. Initialize System (initsys)

The server sends this message to initialize the terminal, deleting all users and logs (but keeping settings).

#### Request

```json
{  
 "cmd": "initsys"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "initsys",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "initsys",  
   "result": false,  
   "reason": 1  
  }
```
### 14\. Reboot (reboot)

The server sends this message to reboot the terminal. The terminal reboots immediately and does not send a response.

#### Request

```json
{  
 "cmd": "reboot"  
}
```
### 15\. Clean All Administrators (cleanadmin)

The server sends this message to demote all administrator users to normal users.

#### Request

```json
{  
 "cmd": "cleanadmin"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "cleanadmin",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "cleanadmin",  
   "result": false,  
   "reason": 1  
  }
```
### 16\. Set Time (settime)

The server sends this message to set the date and time on the terminal.

#### Request

```json
{  
 "cmd": "settime",  
 "cloudtime": "2016-03-25 13:49:30"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "settime",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "settime",  
   "result": false,  
   "reason": 1  
  }
```
### 17\. Set Terminal Parameter (setdevinfo)

The server sends this message to configure various terminal settings. All parameters are optional.

#### Request

```json
{  
 "cmd": "setdevinfo",  
 "deviceid": 1, // Terminal ID  
 "language": 0, // See "Tips" for language options  
 "volume": 0, // 0-10 (default: 6\)  
 "screensaver": 0, // 0: No screensaver, 1-255: Seconds of inactivity  
 "verifymode": 0, // See "Tips" for verification mode options  
 "sleep": 0, // 0: No sleep, 1: Sleep (fingerprint sensor always on)  
 "userfpnum": 3, // Number of fingerprints per user (1-10, default: 3\)  
 "loghint": 1000, // Log threshold for terminal warning (0: no hint)  
 "reverifytime": 0 // Re-verification time (0-255 minutes)  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "setdevinfo",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setdevinfo",  
   "result": false,  
   "reason": 1  
  }
```
#### Extra Tips:

1. **Optional Parameters:** Include only the parameters you want to change. Example:  
   {  
    "cmd": "setdevinfo",  
    "volume": 8,  
    "sleep": 1  
   }
```
   or  
   {  
    "cmd": "setdevinfo",  
    "sleep": true, // true \= 1, false \= 0  
    "volume": 8  
   }
```
2. **Language Options (language):**
   - UILANG_EN: 0 (English)
   - UILANG_SC: 1 (Simplified Chinese)
   - UILANG_TC: 2 (Taiwan Chinese)
   - UILANG_JAPAN: 3 (Japanese)
   - UILANG_NKR: 4 (North Korean)
   - UILANG_SKR: 5 (South Korean)
   - UILANG_THAI: 6 (Thai)
   - UILANG_INDONESIA: 7 (Indonesian)
   - UILANG_VIETNAM: 8 (Vietnamese)
   - UILANG_SPA: 9 (Spanish)
   - UILANG_FAN: 10 (French)
   - UILANG_POR: 11 (Portuguese)
   - UILANG_GEN: 12 (German)
   - UILANG_RUSSIA: 13 (Russian)
   - UILANG_TUR: 14 (Turkish)
   - UILANG_ITALIAN: 15 (Italian)
   - UILANG_CZECH: 16 (Czech)
   - UILANG_ALB: 17 (Arabic)
   - UILANG_PARSI: 18 (Farsi)
3. **Verification Modes (verifymode):**
   - VERIFY_KIND_FP_CARD_PWD: 0 (RFID Card or Fingerprint or Password)
   - VERIFY_KIND_CARD_ADD_FP: 1 (RFID Card and Fingerprint)
   - VERIFY_KIND_PWD_ADD_FP: 2 (Password and Fingerprint)
   - VERIFY_KIND_CARD_ADD_FP_ADD_PWD: 3 (RFID Card and Fingerprint and Password)
   - VERIFY_KIND_CARD_ADD_PWD: 4 (RFID Card and Password)

### 18\. Get Terminal Parameter (getdevinfo)

The server sends this message to retrieve the terminal's current configuration.

#### Request

```json
{  
 "cmd": "getdevinfo"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "getdevinfo",  
   "result": true,  
   "deviceid": 1,  
   "language": 0,  
   "volume": 0,  
   "screensaver": 0,  
   "verifymode": 0,  
   "sleep": 0,  
   "userfpnum": 3,  
   "loghint": 1000,  
   "reverifytime": 0  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getdevinfo",  
   "result": false,  
   "reason": 1  
  }
```
### 19\. Open Door (opendoor)

The server sends this message to open a door connected to the terminal.

#### Request

```json
{  
 "cmd": "opendoor",  
 "doornum": 1 // Door number (1-4 for access controllers). Omit for regular attendance machines.  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "opendoor",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "opendoor",  
   "result": false,  
   "reason": 1  
  }
```
### 20\. Set Access Parameters (setdevlock)

The server sends this message to configure access control parameters for the terminal. All parameters are optional.

#### Request

```json
{  
 "cmd": "setdevlock",  
 "opendelay": 5, // Door open delay (seconds)  
 "doorsensor": 0, // 0: Disable, 1: NC, 2: NO  
 "alarmdelay": 0, // Minutes until alarm if door is not closed (0: disable)  
 "threat": 0, // 0: Disable, 1: Open door and alarm, 2: Just alarm, 3: Just open door  
 "InputAlarm": 0, // 0: Disable, 1: Alarm1 output, 2: Alarm2 output  
 "antpass": 0, // 0: Disable, 1: Host inside, 2: Host outside  
 "interlock": 0, // 0: Disable, 1: Enable  
 "mutiopen": 0, // 0: Disable, 1-4: Number of people required to open door simultaneously  
 "tryalarm": 0, // 0: Disable, 1-10: Number of invalid attempts before alarm  
 "tamper": 0, // 0: Disable, 1: Enable  
 "wgformat": 0, // Wiegand format (0: 26, 1: 34\)  
 "wgoutput": 0, // Wiegand output data: 0: Enroll ID, 1: 1 \+ Enroll ID, 2: Device ID \+ Enroll ID  
 "cardoutput": 0, // 0: Disable, 1: Enable (Wiegand outputs RFID card number on finger press)  
 "dayzone": [ // Up to 8 groups. Each group is a day, with up to 5 sections.  
 {  
 "day": [  
 {"section": "06:00\~07:00"},  
 {"section": "08:30\~12:00"},  
 {"section": "13:00\~17:00"},  
 {"section": "18:00\~21:00"},  
 {"section": "22:00\~23:30"}  
 ]  
 },  
 {  
 "day": [  
 {"section": "00:01\~23:59"}  
 ]  
 }  
 ],  
 "weekzone": [ // Up to 8 groups, each representing a week.  
 {  
 "week": [  
 {"day": 1}, // Monday  
 {"day": 1}, // Tuesday  
 {"day": 1}, // Wednesday  
 {"day": 1}, // Thursday  
 {"day": 1}, // Friday  
 {"day": 2}, // Saturday  
 {"day": 2} // Sunday  
 ]  
 },  
 {  
 "week": [ // Second week zone  
 {"day": 1},  
 {"day": 1},  
 {"day": 1},  
 {"day": 1},  
 {"day": 1},  
 {"day": 2},  
 {"day": 2}  
 ]  
 }  
 ],  
 "lockgroup": [ // For multi-person verification  
 {"group": 1234},  
 {"group": 126},  
 {"group": 348},  
 {"group": 139},  
 {"group": 15}  
 ]  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "setdevlock",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setdevlock",  
   "result": false,  
   "reason": 1  
  }
```
#### Extra Tips:

1. **Short Message Format:** For one dayzone and one weekzone:  
  
```json
   {  
    "cmd": "setdevlock",  
    "dayzone": [{"day": [{"section": "07:00\~18:00"}]}],  
    "weekzone": [{"week": [{"day": 1}]}]  
   }
```
1. **dayzone** and **weekzone** Relationship:
   - user access parameter of weekzone \-\> weekzone[index] \-\> Monday[day] \-\> dayzone[index] \-\> sections
   - Example:
     - weekzone[1] Monday[1] \-\> dayzone[1] section \= "00:01\~23:59" (Access all day)
     - weekzone[1] Tuesday[2] \-\> dayzone[2] section \= "00:00\~00:00" (No access)
2. **lockgroup** Example:
   - Departments: Financial (Tom, Obama, Lily \- group 1), Sales (Clinton, Bush \- group 2), Warehouse (Cruz, Hilari \- group 9\)
   - lockgroup: [129]
     - Obama (group 1\) \+ Bush (group 2\) \+ Cruz (group 9\) _or_
     - Tom (group 1\) \+ Bush (group 2\) \+ Hilari (group 9\) _or_
     - Tom (group 1\) \+ Obama (group 1\) \+ Cruz (group 9\) must verify to open.

### 21\. Get Access Parameter (getdevlock)

The server sends this message to retrieve the current access control parameters from the terminal.

#### Request

```json
{  
 "cmd": "getdevlock"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "getdevlock",  
   "result": true,  
   "opendelay": 5,  
   "doorsensor": 0,  
   "alarmdelay": 0,  
   "threat": 0,  
   "InputAlarm": 0,  
   "antpass": 0,  
   "interlock": 0,  
   "mutiopen": 0,  
   "tryalarm": 0,  
   "tamper": 0,  
   "wgformat": 0,  
   "wgoutput": 0,  
   "cardoutput": 0,  
   "dayzone": [  
   {  
   "day": [  
   {"section": "06:00\~07:00"},  
   {"section": "08:30\~12:00"},  
   {"section": "13:00\~17:00"},  
   {"section": "18:00\~21:00"},  
   {"section": "22:00\~23:30"}  
   ]  
   },  
   {  
   "day": [  
   {"section": "00:01\~23:59"}  
   ]  
   }  
   ],  
   "weekzone": [  
   {  
   "week": [  
   {"day": 1},  
   {"day": 1},  
   {"day": 1},  
   {"day": 1},  
   {"day": 1},  
   {"day": 2},  
   {"day": 2}  
   ]  
   },  
   {  
   "week": [  
   {"day": 1},  
   {"day": 1},  
   {"day": 1},  
   {"day": 1},  
   {"day": 1},  
   {"day": 2},  
   {"day": 2}  
   ]  
   }  
   ],  
   "lockgroup": [  
   {"group": 1234},  
   {"group": 126},  
   {"group": 348},  
   {"group": 139},  
   {"group": 15}  
   ]  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setdevlock",  
   "result": false,  
   "reason": 1  
  }
```
### 22\. Get User Access Parameter (getuserlock)

The server sends this message to retrieve the access control parameters for a specific user.

#### Request

```json
{  
 "cmd": "getuserlock",  
 "enrollid": 1  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "getuserlock",  
   "result": true,  
   "enrollid": 1,  
   "weekzone": 1, // Access controller door 1  
   "weekzone2": 1, // Access controller door 2  
   "weekzone3": 1, // Access controller door 3  
   "weekzone4": 1, // Access controller door 4  
   "group": 1, // 0: No group, 1-9: Group ID  
   "starttime": "2016-03-25 01:00:00", // Valid start time  
   "endtime": "2099-03-25 23:59:00" // Valid end time  
  }
```
- **Failure:**  

```json
  {  
   "ret": "getuserlock",  
   "result": false,  
   "reason": 1  
  }
```
### 23\. Set User Access Parameter (setuserlock)

The server sends this message to set the access control parameters for specific users.

#### Request

```json
{  
 "cmd": "setuserlock",  
 "count": 40, // Max 40 records per request  
 "record": [  
 {  
 "enrollid": 1,  
 "weekzone": 1,  
 "weekzone2": 1, // Access controller door 2  
 "weekzone3": 1,  
 "weekzone4": 1,  
 "group": 1,  
 "starttime": "2016-03-25 01:00:00",  
 "endtime": "2099-03-25 23:59:00"  
 },  
 {  
 "enrollid": 2,  
 "weekzone": 1,  
 "group": 1,  
 "starttime": "2016-03-25 01:00:00",  
 "endtime": "2099-03-25 23:59:00"  
 }  
 ]  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "setuserlock",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setuserlock",  
   "result": false,  
   "reason": 1  
  }
```
### 24\. Delete User Access Parameter (deleteuserlock)

The server sends this message to delete the access control parameters for a specific user.

#### Request

```json
{  
 "cmd": "deleteuserlock",  
 "enrollid": 1  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "deleteuserlock",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "deleteuserlock",  
   "result": false,  
   "reason": 1  
  }
```
### 25\. Clean All User Access Parameters (cleanuserlock)

The server sends this message to delete all user access control parameters.

#### Request

```json
{  
 "cmd": "cleanuserlock"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "cleanuserlock",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "cleanuserlock",  
   "result": false,  
   "reason": 1  
  }
```
### 26\. Get Time (gettime)

The server sends this message to get the terminal date and time.

#### Request

```json
{  
 "cmd":"gettime"  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret":"gettime",  
   "time":"2022-11-09 19:31:49"  
  }
```
### 27\. QR Code Sending (sendqrcode)

The terminal sends this message to send a QR code.
This will not be implemented until some time in the future.

#### Request

```json
{  
 "cmd": "sendqrcode",  
 "sn": "AI07F123456",  
 "record": "123456"  
}
```
### 28\. QR Code Server Reply

The server sends this message as a response to a QR code sent by a terminal.

#### Response

```json
{  
 "ret": "sendqrcode",  
 "result": true,  
 "access": 1, // 1: Open the door, 0: Do not open  
 "enrollid": 10,  
 "username": "tom",  
 "message": "ok"  
}
```
### 29\. Get Questionnaire Parameter (getquestionnaire)

The server sends this message to get the questionnaire parameters from the terminal.

#### Request

```json
{  
 "cmd": "getquestionnaire",  
 "stn": true  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "getquestionnaire",  
   "sn": "AI07F1234567",  
   "result": true,  
   "title": "inout event",  
   "voice": "please select",  
   "errmsg": "please select",  
   "radio": true, // true: single, false: multiple  
   "optionflag": 0,  
   "usequestion": false,  
   "useschedule": false,  
   "card": 0, // 0: do not swipe, 1: swipe card  
   "items": ["in", "out", "onduty", "offduty"], // Max 8 for multiple, 16 for single  
   "schedules": [ // Max 8  
   "00:01-11:12\*1",  
   "11:30-12:30\*3",  
   "13:00-19:00\*4",  
   "00:00-00:00\*0",  
   "00:00-00:00\*0",  
   "00:00-00:00\*0",  
   "00:00-00:00\*0",  
   "00:00-00:00\*0"  
   ]  
  }
```
### 30\. Set Questionnaire Parameter (setquestionnaire)

The server sends this message to set the questionnaire parameters for the terminal.

#### Request

```json
{  
 "cmd": "setquestionnaire",  
 "title": "inout event", // Displayed at the top  
 "voice": "please select", // Optional voice prompt (English or Chinese)  
 "errmsg": "please select", // Error message for multiple-choice, mandatory selection  
 "radio": true, // true: Single choice, false: Multiple choice  
 "optionflag": 0, // Indicates required items in multiple selection  
 "usequestion": true, // Enable questionnaire  
 "useschedule": true, // Enable schedule  
 "card": 0, // 0: do not swipe, 1: swipe card to start  
 "items": ["in", "out", "onduty", "offduty"], // Up to 8 for multiple, 16 for single  
 "schedules": [ // Max 8 event schedules  
 "00:01-11:12\*1",  
 "11:30-12:30\*3",  
 "13:00-19:00\*4",  
 "00:00-00:00\*0",  
 "00:00-00:00\*0",  
 "00:00-00:00\*0",  
 "00:00-00:00\*0",  
 "00:00-00:00\*0"  
 ]  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "setquestionnaire",  
   "sn": "AI07F1234567",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setquestionnaire",  
   "result": false,  
   "reason": 1  
  }
```
### 31\. Get Holiday Parameter (getholiday)

The server sends this message to retrieve the holiday parameters from the terminal.

#### Request

```json
{  
 "cmd": "getholiday",  
 "stn": true  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "getholiday",  
   "sn": "AI07F1234567",  
   "result": true,  
   "holidays": [  
   {  
   "name": "holiday1",  
   "startday": "01-01",  
   "endday": "01-01",  
   "shift": 0,  
   "dayzone": 0  
   },  
   {  
   "name": "holiday2",  
   "startday": "02-01",  
   "endday": "02-07",  
   "shift": 0,  
   "dayzone": 0  
   },  
   {  
   "name": "holiday3",  
   "startday": "05-01",  
   "endday": "05-03",  
   "shift": 0,  
   "dayzone": 0  
   }  
   ]  
  }
```
### 32\. Set Holiday Parameter (setholiday)

The server sends this message to set the holiday parameters for the terminal.

#### Request

```json
{  
 "cmd": "setholiday",  
 "holidays": [ // Maximum 30 holidays  
 {  
 "name": "holiday1", // Holiday name  
 "startday": "01-01", // Holiday start day  
 "endday": "01-01", // Holiday end day  
 "shift": 0, // Attendance shift  
 "dayzone": 0 // Day zone  
 },  
 {  
 "name": "holiday2",  
 "startday": "02-01",  
 "endday": "02-07",  
 "shift": 0,  
 "dayzone": 0  
 },  
 {  
 "name": "holiday3",  
 "startday": "05-01",  
 "endday": "05-03",  
 "shift": 0,  
 "dayzone": 0  
 }  
 ]  
}
```
#### Response

- **Success:**  

```json
  {  
   "ret": "setholiday",  
   "sn": "AI07F1234567",  
   "result": true  
  }
```
- **Failure:**  

```json
  {  
   "ret": "setholiday",  
   "result": false,  
   "reason": 1  
  }
```
