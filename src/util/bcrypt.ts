const bcrypt = require('bcryptjs');

export class Bcrypt {
  static hash(data: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data, salt);
    return hash;
  }
  
  static compare(password: string, hash: string) {
    return bcrypt.compare(hash, password);
  }
}
