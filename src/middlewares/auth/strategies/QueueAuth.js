/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AuthStrategy from './AuthStrategy';
import {isSqsRequest} from '../../../utils/apiQueue';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class QueueAuth extends AuthStrategy
{
    /**
     * @inheritDoc
     */
    async logIn(req, res, next) {
        if (isSqsRequest(req)) {
            next();
            return;
        }

        return super.logIn(req, res, next);
    }
}