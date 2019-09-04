import YAML from 'yamljs';

const environment = process.env.NODE_ENV || 'development';
const config = YAML.load(`assets/config/${environment}.yml`);

console.log(`Loading configuration for [${environment}]`);
export default config;