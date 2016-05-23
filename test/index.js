'use strict';

require('mocha');

const exec = require('child_process').exec;
const argv = require('yargs').argv;
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;
const asPromised = require('chai-as-promised');
const plugin = require('../');


describe('gulp-codedeploy', function () {

  describe('plugin instantiation', function () {
    it('should exist', function () {
      expect(plugin).to.exist;
    });

    it('should be a function', function () {
      expect(plugin).to.be.a('function');
    });

    it('should throw an error if no options are supplied', function () {
      expect((function () {
        new plugin();
      })).to.throw('Missing options');
    });
  });


  describe('getTag()', function () {

    const Plugin = new plugin({ });
    const response = 'aws deploy create-deployment --application-name asi-plm --s3-location bucket=asi-webdev-codedeploy,key=plm/plm-v0.1.0.zip,bundleType=zip,eTag="8ba1946a3a15fa95566af19328577710" --deployment-group-name development --deployment-config-name CodeDeployDefault.OneAtATime --description';

    it('should only return the etag', function () {
      let expected = "8ba1946a3a15fa95566af19328577710";
      let actual = Plugin.getTag(response);

      expect(actual).to.eql(expected);
    });

    it('should be a string', function () {
      let etag = Plugin.getTag(response);

      expect(etag).to.be.a('string');
    });
  });


  describe('getDeploymentId()', function () {
    const response = '{ "deploymentId": "d-VFY9K81UF" }';

    it('should only return the id', function () {
      let expected = "d-VFY9K81UF";
      let actual = plugin.getDeploymentId(response);

      expect(actual).to.eql(expected);
    });

    it('should be a string', function () {
      let actual = plugin.getDeploymentId(response);

      expect(actual).to.be.a('string');
    });
  });


  describe('Command Line Arguments', function () {

    it('should set default description as default', function () {
      let description = "No description supplied";
      let actual = "No description supplied";

      expect(actual).to.eql(description);
    });
  });


  describe('getOptions()', function () {

    it('should return the options property', function () {
      const Plugin = new plugin({});
      expect(Plugin.options).to.be.a('object');
    });

    it('should apply options to the options property', function () {
      let expectedOptions = {
        options: {
          appName: "fakeApp",
          bucket: "fakeApp",
          source: 'dist',
          subdir: "fakeDirectory",
          fileName: "file.zip",
          deploymentGroup: "development",
          defaultDescription: "No description set",
          deployConfig: 'CodeDeployDefault.OneAtATime'
        }
      };

      let actualOptions = new plugin({
        appName: "fakeApp",
        bucket: "fakeApp",
        source: 'dist',
        subdir: "fakeDirectory",
        fileName: "file.zip",
        deploymentGroup: "development",
        defaultDescription: "No description set",
        deployConfig: 'CodeDeployDefault.OneAtATime'
      });

      expect(actualOptions).to.eql(expectedOptions);
    });
  });


  describe('getPushExecString()', function () {
    it('returns the push command using the options', function () {
      let Plugin = new plugin({
        appName: "fakeApp",
        bucket: "fakeApp",
        source: 'dist',
        subdir: "fakeDirectory",
        fileName: "file.zip",
        deploymentGroup: "development",
        defaultDescription: "No description set",
        deployConfig: 'CodeDeployDefault.OneAtATime'
      });
   
      let command = Plugin.createPushExecutableString();
      let expected = `aws deploy push --application-name fakeApp --s3-location s3://fakeApp/fakeDirectory/file.zip --description "No description set" --source dist`;

      expect(command).to.eql(expected);
    });
  });


  describe('getDeployExecString()', function () {
    it('returns the deploy command using the options', function () {
      let Plugin = new plugin({
        appName: "fakeApp",
        bucket: "fakeApp",
        source: 'dist',
        subdir: "fakeDirectory",
        fileName: "file.zip",
        deploymentGroup: "development",
        defaultDescription: "No description set",
        deployConfig: 'CodeDeployDefault.OneAtATime'
      });

      let command = Plugin.createDeployExecutableString(`aws deploy create-deployment --application-name fakeApp --s3-location bucket=fakeApp,key=fakeDirectory/file.zip,bundleType=zip,eTag="8ba1946a3a15fa95566af19328577710" --deployment-group-name <deployment-group-name> --deployment-config-name <deployment-config-name> --description <description>`);

      let expected = `aws deploy create-deployment --application-name fakeApp --s3-location bucket=fakeApp,key=fakeDirectory/file.zip,bundleType=zip,eTag="8ba1946a3a15fa95566af19328577710" --deployment-group-name development --deployment-config-name CodeDeployDefault.OneAtATime --description "No description set"`;

      expect(command).to.eql(expected);
    });
  });
});