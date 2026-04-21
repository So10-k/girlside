/**
 * A small mock "database" that's injected into every preview iframe so
 * learners can build signup / login flows without any real backend.
 *
 * Exposed inside the iframe as `window.db`:
 *   db.users.create({ username, password, ... })
 *   db.users.all()
 *   db.users.find({ username })
 *   db.collection('posts')             // dynamic named collection
 *   db.auth.signUp({ username, password })
 *   db.auth.signIn(username, password)
 *   db.auth.currentUser()
 *   db.auth.signOut()
 *   db.reset()
 *
 * State lives in-memory inside the iframe — it survives clicks within one
 * preview session, and resets on every preview reload. That's a good
 * pedagogical property: deterministic, private, and nothing leaves the page.
 */
export const MOCK_DB_RUNTIME = `
<script>
(function () {
  if (window.db) return;
  var store = {};
  var idSeq = 1;
  var session = null;

  function log(op, args, result) {
    try {
      var previewArgs = args.map(function (a) {
        if (a && typeof a === 'object' && 'password' in a) {
          var copy = Object.assign({}, a);
          copy.password = '•'.repeat(String(copy.password).length);
          return copy;
        }
        return a;
      });
      console.log('[db]', op, previewArgs, '→', result);
    } catch (e) {}
  }
  function bucket(name) {
    if (!store[name]) store[name] = [];
    return store[name];
  }
  function matches(rec, query) {
    var keys = Object.keys(query || {});
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (rec[k] !== query[k]) return false;
    }
    return true;
  }
  function collection(name) {
    return {
      create: function (fields) {
        if (!fields || typeof fields !== 'object') throw new Error('db.' + name + '.create needs an object like { username: "sam" }');
        var rec = Object.assign({ id: idSeq++, createdAt: Date.now() }, fields);
        bucket(name).push(rec);
        log(name + '.create', [fields], rec);
        return rec;
      },
      all: function () {
        var arr = bucket(name).slice();
        log(name + '.all', [], arr);
        return arr;
      },
      find: function (query) {
        var hit = bucket(name).find(function (r) { return matches(r, query); }) || null;
        log(name + '.find', [query], hit);
        return hit;
      },
      findAll: function (query) {
        var hits = bucket(name).filter(function (r) { return matches(r, query); });
        log(name + '.findAll', [query], hits);
        return hits;
      },
      count: function () { return bucket(name).length; },
      update: function (id, fields) {
        var rec = bucket(name).find(function (r) { return r.id === id; });
        if (!rec) return null;
        Object.assign(rec, fields, { updatedAt: Date.now() });
        log(name + '.update', [id, fields], rec);
        return rec;
      },
      remove: function (id) {
        var arr = bucket(name);
        var i = arr.findIndex(function (r) { return r.id === id; });
        if (i === -1) return false;
        arr.splice(i, 1);
        log(name + '.remove', [id], true);
        return true;
      }
    };
  }

  var users = collection('users');
  var auth = {
    signUp: function (fields) {
      if (!fields || !fields.username || !fields.password) {
        throw new Error('signUp needs at least { username, password }');
      }
      if (users.find({ username: fields.username })) {
        throw new Error('That username is already taken — try another.');
      }
      var user = users.create(fields);
      session = { userId: user.id, since: Date.now() };
      log('auth.signUp', [fields], user);
      return user;
    },
    signIn: function (username, password) {
      var user = users.find({ username: username });
      if (!user || user.password !== password) {
        log('auth.signIn', [username], null);
        return null;
      }
      session = { userId: user.id, since: Date.now() };
      log('auth.signIn', [username], user);
      return user;
    },
    signOut: function () {
      session = null;
      log('auth.signOut', [], true);
    },
    currentUser: function () {
      if (!session) return null;
      return users.find({ id: session.userId });
    },
    session: function () { return session; }
  };

  window.db = {
    users: users,
    auth: auth,
    collection: collection,
    reset: function () {
      for (var k in store) delete store[k];
      session = null;
      idSeq = 1;
      log('db.reset', [], true);
    },
    /** seed a few demo accounts so learners can test sign-in right away */
    seedDemoUsers: function () {
      if (users.count() > 0) return;
      users.create({ username: 'ada', password: 'lovelace', displayName: 'Ada' });
      users.create({ username: 'grace', password: 'hopper', displayName: 'Grace' });
      log('db.seedDemoUsers', [], users.all());
    }
  };
})();
</script>`;
