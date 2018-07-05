/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import LocalStorage from './storages/LocalStorage';
import AwsS3Storage from './storages/AwsS3Storage';
import LocalMessageQueue from './queues/LocalMessageQueue';
import AwsSqsMessageQueue from './queues/AwsSqsMessageQueue';
import {logErrors} from './middlewares/logs';
import {showError500} from "./middlewares/errors";
import {isProd} from './utils/server';
import packageRoutes from './routes/packageRoutes';
import hookRoutes from './routes/hookRoutes';

const app = express();
let storage,
    queue;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (isProd()) {
    app.use(compression());
    app.use(awsServerlessExpressMiddleware.eventContext());
    storage = new AwsS3Storage(process.env.AWS_S3_BUCKET, process.env.AWS_REGION);
    queue = new AwsSqsMessageQueue(process.env.AWS_REGION, process.env.AWS_ACCOUNT_ID, process.env.AWS_SQS_QUEUE_NAME);
} else {
    storage = new LocalStorage('./var/' + process.env.AWS_S3_BUCKET);
    queue = new LocalMessageQueue();
}

app.set('storage', storage);
app.set('queue', queue);
app.use('/', hookRoutes(express.Router({}), app.set('storage')));
app.use('/', packageRoutes(express.Router({}), app.set('storage')));
app.use(logErrors);
app.use(showError500);

export default app;
