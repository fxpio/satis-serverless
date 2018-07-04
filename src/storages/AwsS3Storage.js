/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const AWS = require('aws-sdk');

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
module.exports = class AwsS3Storage
{
    /**
     * Constructor.
     *
     * @param {String} bucket The AWS S3 bucket
     * @param {String} region The AWS S3 region
     */
    constructor(bucket, region) {
        this.client = new AWS.S3({apiVersion: '2006-03-01', region: region});
        this.bucket = bucket;
    }

    /**
     * Check if the storage has the key.
     *
     * @param {String} key The key
     *
     * @return {Promise<boolean>}
     */
    async has(key) {
        let params = {
            Bucket: this.bucket,
            MaxKeys: 1,
            Prefix: key
        };

        let objects = await this.client.listObjectsV2(params).promise();

        return 1 === objects.KeyCount;
    }
};
