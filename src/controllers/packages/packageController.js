/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PackageManager from '../../composer/packages/PackageManager';
import PackageBuilder from '../../composer/packages/PackageBuilder';
import Cache from '../../caches/Cache';
import HttpNotFoundError from '../../errors/HttpNotFoundError';

/**
 * Display the root packages.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showRootPackages(req, res, next) {
    /** @type Cache cache */
    let cache = req.app.set('cache');
    /** @type PackageBuilder builder */
    let builder = req.app.set('package-builder');

    let content = await cache.getRootPackages();

    if (!content) {
        content = await builder.buildRootPackages();
    }

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(await cache.setRootPackages(content));
}

/**
 * Display the package definition for a specific version.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showPackageVersion(req, res, next) {
    /** @type PackageManager manager */
    let manager = req.app.set('package-manager');
    let packageName = req.params.vendor + '/' +req.params.package;
    let version = req.params.version;
    let resPackage = await manager.findPackage(packageName, version);

    if (resPackage) {
        res.json(resPackage.getComposer());
        return;
    }

    throw new HttpNotFoundError();
}

/**
 * Display the list of all package versions.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function showPackageVersions(req, res, next) {
    /** @type Cache cache */
    let cache = req.app.set('cache');
    /** @type PackageBuilder builder */
    let builder = req.app.set('package-builder');
    let packageName = req.params.vendor + '/' + req.params.package;
    let hash = null;
    let matchHash = packageName.match(/([a-zA-Z0-9\-_\/]+)\$([\w\d]+)/);

    if (matchHash) {
        packageName = matchHash[1];
        hash = matchHash[2];

        let content = await cache.getPackageVersions(packageName, hash);
        if (!content) {
            let res = builder.buildVersions(packageName, hash);
            content = res ? res.content : null;
        }

        if (content) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(content);
            return;
        }
    }

    throw new HttpNotFoundError();
}

/**
 * Track the download of package version.
 *
 * @param {IncomingMessage} req  The request
 * @param {ServerResponse}  res  The response
 * @param {Function}        next The next callback
 */
export async function trackDownloadBatch(req, res, next) {
    /** @type PackageManager */
    let packageManager = req.app.set('package-manager');

    for (let track of req.body.downloads) {
        await packageManager.trackDownload(track.name, track.version);
    }

    res.status(204).send();
}
