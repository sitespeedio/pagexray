'use strict';

const test = require('ava');
const har = require('./helpers/har');

test('Redirect: domains should be the final destination of the redirect', t => {
  const result = har.pagesFromTestHar(
    'redirect/aftonbladet.se-redirecting-to-www.har'
  );
  t.is(result[0].baseDomain, 'www.aftonbladet.se');
});

test('Redirect: the final URL should be right', t => {
  const result = har.pagesFromTestHar(
    'redirect/www.sitespeed.io-redirecting-to-https.har'
  );
  t.is(result[0].finalUrl, 'https://www.sitespeed.io/');
  t.is(result[0].documentRedirects, 1);
});

test('Redirect: handle relative urls', t => {
  const result = har.pagesFromTestHar('redirect/assa.har');
  t.is(result[0].finalUrl, 'https://www.assa.se/sv/site/assa/');
});

test('Redirect: handle redirects back to the same page (one level)', t => {
  const result = har.pagesFromTestHar('redirect/redirect-and-redirect-back.har');
  t.is(result[0].documentRedirects, 3);
  t.is(result[0].finalUrl, 'https://checkout.mytoys.de/checkout/registration');
});

test('Redirect: parse arcelormittal.com', t => {
  const result = har.pagesFromTestHar('redirect/arcelormittal.com.har');
  t.is(result[0].documentRedirects, 4);
  t.is(result[0].finalUrl, 'http://m.corporate.arcelormittal.com/');
});

test('Redirect: parse mousel.lu', t => {
  const result = har.pagesFromTestHar('redirect/mousel.lu.har');
  t.is(result[0].documentRedirects, 1);
  t.is(result[0].finalUrl, 'http://www.brasseriedeluxembourg.lu/');
});

test('Redirect: parse www.etat.lu', t => {
  const result = har.pagesFromTestHar('redirect/www.etat.lu.har');
  t.is(result[0].documentRedirects, 2);
  t.is(result[0].finalUrl, 'http://www.etat.public.lu/fr/index.php');
});

test('Redirect: parse mytoys.de.har', t => {
  const result = har.pagesFromTestHar('redirect/mytoys.de.har');
  t.is(result[0].documentRedirects, 3);
  t.is(result[0].finalUrl, 'https://checkout.mytoys.de/checkout/registration');
});

test.todo(
  'Redirect: identify frontend redirects or at least maybe guess them'
);
