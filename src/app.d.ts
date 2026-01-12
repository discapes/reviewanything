declare global {
  declare namespace App {
    interface Locals {
      db: Drizzle.DB<any>;
    }

    interface Platform { }

    interface Session { }

    interface Stuff { }
  }
}

