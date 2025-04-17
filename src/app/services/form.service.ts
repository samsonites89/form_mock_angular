import { Injectable } from '@angular/core';
import { Database, ref, get, child } from '@angular/fire/database';
import { CreateRequestBody, CompleteRequestBody } from '../models/request.model'; // Adjust the path as needed
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for HMAC SHA256

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private sharedSecret: string = '';

  constructor(private database: Database) {
    const dbRef = ref(this.database);
    get(child(dbRef, 'password'))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.sharedSecret = snapshot.val(); // Set the password if it exists in Firebase
            } else {
              console.log('No password found in Firebase.');
            }
          })
          .catch((error) => {
            console.error('Error loading password from Firebase:', error);
          });
  }

  async CreateFormUriPayload(url: string, body: CreateRequestBody) : Promise<Object> {
    if (body.external_form_id === undefined ||
      body.smart_action_id === undefined) {
      throw new Error("required params missing." +
      "requires `external_form_id` and `snart_action_id`");
    }

    const payload = {
      external_form_id: body.external_form_id,
      smart_action_id: body.smart_action_id,
      uri: url+"/form?smart_action_id=" + body.smart_action_id,

    };
    Object.keys(payload).sort();
    const signature = this.generateSignature(this.sharedSecret, payload);

    const response = {
      type: "form_data",
      signature: signature,
      data: payload,
    };

    return response;
  }

  CreateFormCompletedPayload(requestBody: CompleteRequestBody) : Object | undefined {
    const secret = this.sharedSecret;
    console.log('test');

    let payload: CompleteRequestBody = {
      status: requestBody.status,
      smart_action_id: Number(requestBody.smart_action_id),
      timestamp: new Date().toISOString(),
    }


    if (requestBody.status !== "success") {
      payload.details = this.details(requestBody.status);
    }

    Object.keys(payload).sort();
    console.log(payload);
    const signature = this.generateSignature(secret, payload);


    const message = {type: "form_completed", signature, data: payload};

    return message;
  }

  private generateSignature(secret: string, payload: Object) {
    const payloadString = JSON.stringify(payload, null, 0);
    const hmac = CryptoJS.HmacSHA256(payloadString, secret);

    return CryptoJS.enc.Base64.stringify(hmac);
  }

  // eslint-disable-next-line require-jsdoc
  private sort(payload: Object) {
    const map = new Map(Object.entries(payload).sort());
    return Object.fromEntries(map);
  }

  private details(status: string) : Object| undefined {
    if (status === "error") {
      return {
        error_code: "400",
        message: "validation error",
      };
    } else if (status === "cancelled") {
      return {
        message: "User cancelled the form submission.",
      };
    }
    return undefined; // Default return for unhandled cases
  }
}
