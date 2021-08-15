const axios = require ("axios");
const moment = require ("moment");
const fs = require("fs/promises"); 
const mysql = require('mysql2/promise');
const { resolve } = require("path");
//僅需要require
require('dotenv').config();

