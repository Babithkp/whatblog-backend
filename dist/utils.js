"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.userVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const myGmail = process.env.GOOGLE_APP_USER;
const pass = process.env.GOOGLE_APP_PASS;
if (!myGmail || !pass) {
    throw new Error("Missing OAuth2 environment variables.");
}
const userVerificationEmail = (code) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>105256 is your Cadalu verification code</title>
        <style type="text/css">
            #outlook a {
                padding: 0
            }

            .ExternalClass {
                width: 100%
            }

            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%
            }

            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%
            }

            table,
            td {
                mso-table-lspace: 0;
                mso-table-rspace: 0
            }

            img {
                -ms-interpolation-mode: bicubic
            }

            img {
                border: 0;
                outline: none;
                text-decoration: none
            }

            a img {
                border: none
            }

            td img {
                vertical-align: top
            }

            table,
            table td {
                border-collapse: collapse
            }

            body {
                margin: 0;
                padding: 0;
                width: 100% !important
            }

            .mobile-spacer {
                width: 0;
                display: none
            }

            @media all and (max-width:639px) {
                .container {
                    width: 100% !important;
                    max-width: 600px !important
                }

                .mobile {
                    width: auto !important;
                    max-width: 100% !important;
                    display: block !important
                }

                .mobile-center {
                    text-align: center !important
                }

                .mobile-right {
                    text-align: right !important
                }

                .mobile-left {
                    text-align: left !important;
                }

                .mobile-hidden {
                    max-height: 0;
                    display: none !important;
                    mso-hide: all;
                    overflow: hidden
                }

                .mobile-spacer {
                    width: auto !important;
                    display: table !important
                }

                .mobile-image,
                .mobile-image img {
                    height: auto !important;
                    max-width: 600px !important;
                    width: 100% !important
                }
            }
        </style>
        <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
    </head>

    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <span style="color: transparent; display: none; height: 0px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; visibility: hidden; width: 0px;">Your Cadalu verification code</span>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="body" style="width: 100%;">
            <tbody>
                <tr>
                    <td align="center" valign="top" style="vertical-align: top; line-height: 1; padding: 48px 32px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" class="header container" style="width: 600px;">       
                            <tbody>
                                <tr>
                                    <td align="left" valign="top" style="vertical-align: top; line-height: 1; padding: 16px 32px;">
                                        <p style="padding: 0px; margin: 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 24px; line-height: 36px;">
                                            <img width="128" src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJwU2FuOXBia2lJZ0NQamVHd21WN3lEWWxpcyJ9" alt="Cadalu Logo" style="max-width: 128px; width: 128px;"></a>        
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" border="0" width="600" class="main container" style="width: 600px; border-collapse: separate;">
                            <tbody>
                                <tr>
                                    <td align="left" valign="top" bgcolor="#fff" style="vertical-align: top; line-height: 1; background-color: #ffffff; border-radius: 0px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="block" style="width: 100%; border-collapse: separate;">
                                            <tbody>
                                                <tr>
                                                    <td align="left" valign="top" bgcolor="#ffffff" style="vertical-align: top; line-height: 1; padding: 32px 32px 48px; background-color: #ffffff; border-radius: 0px;">
                                                        <h1 class="h1" align="left" style="padding: 0px; margin: 0px; font-style: normal; font-family: Helvetica, Arial, sans-serif; font-size: 32px; line-height: 39px; color: #000000; font-weight: bold;"> Verification code </h1>   
                                                        <p align="left" style="padding: 0px; margin: 32px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;"> Enter the following verification code when prompted: </p>
                                                        <p style="padding: 0px; margin: 16px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 40px; line-height: 60px;">
                                                            <b>${code}</b>
                                                        </p>
                                                        <p style="padding: 0px; margin: 16px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;"> To protect your account, do not share this code. </p>
                                                        <p style="padding: 0px; margin: 64px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;">
                                                            <b>Didn't request this?</b>
                                                        </p>
                                                        <p style="padding: 0px; margin: 4px 0px 0px; font-family: Helvetica, Arial, sans-serif; color: #000000; font-size: 14px; line-height: 21px;"> This code was requested, If you didn't make this request, you can safely ignore this email. </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>

</html>`;
exports.userVerificationEmail = userVerificationEmail;
const sendVerificationEmail = (email, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: myGmail,
                pass: pass,
            },
        });
        const info = yield transporter.sendMail({
            from: `WhatBlog <${myGmail}>`,
            to: email,
            subject: subject,
            html: body,
        });
        console.log("Email sent successfully:", info.messageId);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
