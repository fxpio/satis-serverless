#!/usr/bin/env node

/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

require('dotenv').config();
const program = require('commander');
const utils = require('./utils/utils');

program
    .description('Deploy the packaged project in AWS Cloud Formation')
    .parse(process.argv);

utils.exec('aws cloudformation deploy --template-file packaged-sam.yaml --stack-name {AWS_CLOUD_FORMATION_STACK_NAME} --capabilities CAPABILITY_IAM --region {AWS_REGION}');
