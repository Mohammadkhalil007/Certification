/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict';

const {Contract} = require('fabric-contract-api');

class Transaction extends Contract {


    
async initLedger(ctx) {
    console.info('============= Initialize Ledger ===========');
    await ctx.stub.putState("Test", "Wallet Logic")
    return "success"
}
                                            /*================Gender Check================*/

// GenderCheck=(gender)=>{
//     let ValueEnum = {
//         0:"Male",
//         1:"Female",
//         2:"Transgender",
//       };
//       const length1 = Object.keys(ValueEnum).length;
//       for(let i=0; i<=length1; i++) {
//           if(gender===ValueEnum[i]) {
//             console.log(gender);
//             return gender;
//           }
//           else{
//             console.log("Gender value is not exist in Database");
//             break;
//           }
//       }    
// }
                                            /*================User_Creation===============*/

async createStudent(ctx, stdId, name, email, phoneNo, gender, DOB, country, city, postalCode, universityName, documentName, documentLink, timestamp) {
// this.GenderCheck(gender);
    const transaction = {
                    stdId, 
                    docType: 'CREATEUSER',
                    organization : 'organization-1',
                    name,
                    email,
                    phoneNo,
                    gender,
                    DOB,
                    country,
                    city,
                    postalCode,
                    universityName,
                    documentName,
                    documentLink,
                    timestamp
                };

   await ctx.stub.putState(stdId, Buffer.from(JSON.stringify(transaction)));
  console.info(`============= Student Created with : ${stdId}===========`,transaction);

   
}
                                            /*=============GET ALL CREATED USER============*/
async queryAllUsers(ctx){
    const startKey = 'userId0';
    const endKey = 'userId999';
    const allResults = [];
    for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
        const strValue = Buffer.from(value).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
        } catch (err) {
            console.log(err);
            record = strValue;
        }
        allResults.push({ Key: key, Record: record });
    }
    console.info(allResults);
    return JSON.stringify(allResults);
}
                                            /*==============Create Univerity ==============*/
// Univeristy Params: id, DocumentnName, issuedDate, ExpiredDate, Status (Accepted / Rejected ), timestamp  
async univeristyData(ctx, uniId,stdId,universityName,documentnName,issuedDate, ExpiredDate,status,timestamp){
    /*trying to verify stdId and univeristyName with using a same function************/
//     let verifyData={
//         0:stdId,
//         1:universityName
//     };
//     const EnumLength = Object.keys(verifyData).length;
//     for(let i=0; i<=EnumLength; i++) {
//     const verifyableData = await ctx.stub.getState(i); 
//     if (!verifyableData || verifyableData.length === 0) {
//         throw new Error(`${verifyableData} does not exist`);
//     }
// }
//     const studentId = JSON.parse(stdAsBytes.toString());
//     console.log(studentId);


    const stdAsBytes = await ctx.stub.getState(stdId); 
    if (!stdAsBytes || stdAsBytes.length === 0) {
        throw new Error(`${stdId} does not exist`);
    }
    const studentId = JSON.parse(stdAsBytes.toString());
    console.log(studentId);

    // const universityAsBytes = await ctx.stub.getState(universityName); 
    // if (!universityAsBytes || universityAsBytes.length === 0) {
    //     throw new Error(`${universityName} does not exist`);
    // }
    // const university = JSON.parse(universityAsBytes.toString());
    // console.log(university);

     var data = {
             uniId,
             docType: 'univeristyData',
             stdId,
             documentnName,
             status,
             issuedDate,
             universityName,
             ExpiredDate,
             timestamp
     }
     await ctx.stub.putState(uniId, Buffer.from(JSON.stringify(data)));
     console.log(`university id: ${uniId} updated record of student id: ${stdId} and it status: ${status}`);
     return true;
}
                                            /*=========GET ALL university records==========*/
async queryAllUniveristy(ctx){
    const startKey = 'u1';
    const endKey = 'u999';
    const allResults = [];
    for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
        const strValue = Buffer.from(value).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
        } catch (err) {
            console.log(err);
            record = strValue;
        }
        allResults.push({ Key: key, Record: record });
    }
    console.info(allResults);
    return JSON.stringify(allResults);
}
                          
}
module.exports = Transaction;