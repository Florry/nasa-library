const Jasmine = require("jasmine");
const SpecReporter = require("jasmine-spec-reporter").SpecReporter;
const jRunner = new Jasmine({});
const noop = function () { };

jRunner.configureDefaultReporter({ print: noop });

jasmine.getEnv().addReporter(new SpecReporter());

jRunner.loadConfigFile("./spec/support/jasmine.json");
jRunner.execute();

export default () => { };
