# IPFS Web3 Authed Fateway Performance Report

## Intro

This report includes the performance metrics of upload (store) and download (retrieve) processes with the following listed services:

1. IPFS Web3 Authed gateway
2. Pinata gateway
3. Tencent COS(Centralized Cloud Server)
4. [Download] IPFS command line(IPFS protocol)

## Testing Process

- In the upload process, files are uploaded from 2 different test machines to the listed services via HTTP/HTTPS.
- In the download process, files are downloaded from the listed services to 2 different test machines via HTTP/HTTPS/IPFS.

## Testing Params

1. Test machines

|Testing Machine|Environment|
|---------------|-----------|
|Host-1         |Tencent COS (Shanghai)|
|Host-2         |Tencent COS (Singapore)|

2. Test files

|File Name|File Size|
|---------|---------|
|1M-1     |1MB      |
|1M-2     |1MB      |
|1M-3     |1MB      |
|200M-1   |200MB    |
|200M-2   |200MB    |
|200M-3   |200MB    |
|500M-1   |500MB    |
|500M-2   |500MB    |
|500M-3   |500MB    |

*Note that: IPFS Web3 Authed gateway uses IPFS Thunder gateway in China, all the testing data produced with thunder gateway.

## Detailed testing process

### 1. [Upload] 1M file

 **Host 1 → IPFS Thunder Gateway**

![Picture2.png](img/Picture2.png)

**Host 1 → Pinata**

![Picture3.png](img/Picture3.png)

**Host 1 →Tencent COS**

![Picture4.png](img/Picture4.png)

### 2. [Upload] 200MB file

**Host 1 → IPFS Thunder Gateway**

![Picture5.png](img/Picture5.png)

**Host 1 → Pinata**

![Untitled](img/Untitled.png)

**Host 1 →Tencent COS**

![Untitled](img/Untitled%201.png)

### 3. [Upload] 500MB file

**Host 1 → IPFS Thunder Gateway**

![Picture8.png](img/Picture8.png)

**Host 1 → Pinata**

![Picture9.png](img/Picture9.png)

**Host 1 →Tencent COS**

![Picture10.png](img/Picture10.png)

> Host 2(Singapore) also tested like above
> 

### 4. [Download] 1MB file

**IPFS Thunder Gateway → Host 1**

![Picture1.png](img/Picture1.png)

**Pinata → Host 1**

![Picture2.png](img/Picture2%201.png)

**Tencent COS → Host 1**

![Picture3.png](img/Picture3%201.png)

**IPFS Command on Host 1**

![Picture4.png](img/Picture4%201.png)

### 5. [Download] 200MB file

**IPFS Thunder Gateway → Host 1**

![Picture2-1.png](img/Picture2-1.png)

**Pinata → Host 1**

![Picture2-2.png](img/Picture2-2.png)

**Tencent COS → Host 1**

![Picture2-3.png](img/Picture2-3.png)

**IPFS Command on Host 1**

![Picture2-4.png](img/Picture2-4.png)

### 6. [Download] 500MB file

**IPFS Thunder Gateway → Host 1**

![Picture5-1.png](img/Picture5-1.png)

**Pinata → Host 1**

![Picture5-2.png](img/Picture5-2.png)

**Tencent COS → Host 1**

![Picture5-3.png](img/Picture5-3.png)

**IPFS Command on Host 1**

![Picture5-4.png](img/Picture5-4.png)

> Host 2(Singapore) also tested like above
> 

# Summary

## Upload Metrics (in seconds)

![Untitled](img/Untitled%202.png)

## Download Metrics (in seconds)

![Untitled](img/Untitled%203.png)