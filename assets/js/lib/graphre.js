!(function (e, r) {
  "object" == typeof exports && "undefined" != typeof module
    ? r(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], r)
    : r(
        ((e =
          "undefined" != typeof globalThis ? globalThis : e || self).graphre =
          {})
      );
})(this, function (e) {
  "use strict";
  class r {
    constructor() {
      var e = {};
      (e._next = e._prev = e), (this._sentinel = e);
    }
    dequeue() {
      var e = this._sentinel,
        r = e._prev;
      if (r !== e) return n(r), r;
    }
    enqueue(e) {
      var r = this._sentinel,
        t = e;
      t._prev && t._next && n(t),
        (t._next = r._next),
        (r._next._prev = t),
        (r._next = t),
        (t._prev = r);
    }
    toString() {
      for (var e = [], r = this._sentinel, n = r._prev; n !== r; )
        e.push(JSON.stringify(n, t)), (n = n._prev);
      return "[" + e.join(", ") + "]";
    }
  }
  function n(e) {
    (e._prev._next = e._next),
      (e._next._prev = e._prev),
      delete e._next,
      delete e._prev;
  }
  function t(e, r) {
    if ("_next" !== e && "_prev" !== e) return r;
  }
  var o = Object.freeze({ __proto__: null, List: r });
  const i = {};
  function a(e) {
    var r = [];
    for (var n of e) r.push(...n);
    return r;
  }
  function s(e, r) {
    return null != e && e.hasOwnProperty(r);
  }
  function d(e) {
    const r = null == e ? 0 : e.length;
    return r ? e[r - 1] : void 0;
  }
  function u(e, r) {
    e = Object(e);
    const n = {};
    return (
      Object.keys(e).forEach((t) => {
        n[t] = r(e[t], t);
      }),
      n
    );
  }
  function f(e, r) {
    var n = Number.POSITIVE_INFINITY,
      t = void 0;
    for (var o of e) {
      var i = r(o);
      i < n && ((n = i), (t = o));
    }
    return t;
  }
  function h(e, r) {
    var n = e < r ? 1 : -1;
    let t = -1,
      o = Math.max(Math.ceil((r - e) / (n || 1)), 0);
    const i = new Array(o);
    for (; o--; ) (i[++t] = e), (e += n);
    return i;
  }
  function c(e, r) {
    return e.slice().sort((e, n) => r(e) - r(n));
  }
  function v(e) {
    i[e] || (i[e] = 0);
    return `${e}${++i[e]}`;
  }
  function l(e) {
    return e ? Object.keys(e).map((r) => e[r]) : [];
  }
  function g(e, r) {
    for (var n = [], t = 0; t < e; t++) n.push(r());
    return n;
  }
  function p(e) {
    return void 0 === e;
  }
  function m(e, r) {
    for (var n of Object.keys(e)) r(e[n], n);
  }
  function w(e) {
    return 0 === Object.keys(e).length;
  }
  function _(e) {
    var r = {},
      n = e.nodes().filter((r) => !e.children(r).length),
      t = g(Math.max(...n.map((r) => e.node(r).rank)) + 1, () => []);
    return (
      c(n, (r) => e.node(r).rank).forEach(function n(o) {
        if (!s(r, o)) {
          r[o] = !0;
          var i = e.node(o);
          t[i.rank].push(o), e.successors(o).forEach(n);
        }
      }),
      t
    );
  }
  function b(e, r) {
    for (var n = 0, t = 1; t < r.length; ++t) n += y(e, r[t - 1], r[t]);
    return n;
  }
  function y(e, r, n) {
    for (var t = {}, o = 0; o < n.length; o++) t[n[o]] = o;
    for (
      var i = a(
          r.map(function (r) {
            return c(
              e.outEdges(r).map(function (r) {
                return { pos: t[r.w], weight: e.edge(r).weight };
              }),
              (e) => e.pos
            );
          })
        ),
        s = 1;
      s < n.length;

    )
      s <<= 1;
    var d = 2 * s - 1;
    s -= 1;
    var u = g(d, () => 0),
      f = 0;
    return (
      i.forEach(function (e) {
        var r = e.pos + s;
        u[r] += e.weight;
        for (var n = 0; r > 0; )
          r % 2 && (n += u[r + 1]), (u[(r = (r - 1) >> 1)] += e.weight);
        f += e.weight * n;
      }),
      f
    );
  }
  function k(e, r) {
    return r
      ? r.map(function (r) {
          var n = e.inEdges(r);
          if (n.length) {
            var t = n.reduce(
              function (r, n) {
                var t = e.edge(n),
                  o = e.node(n.v);
                return {
                  sum: r.sum + t.weight * o.order,
                  weight: r.weight + t.weight,
                };
              },
              { sum: 0, weight: 0 }
            );
            return { v: r, barycenter: t.sum / t.weight, weight: t.weight };
          }
          return { v: r };
        })
      : [];
  }
  function E(e, r) {
    for (var n = {}, t = 0; t < e.length; t++) {
      var o = e[t],
        i = (n[o.v] = { indegree: 0, in: [], out: [], vs: [o.v], i: t });
      void 0 !== o.barycenter &&
        ((i.barycenter = o.barycenter), (i.weight = o.weight));
    }
    for (var a of r.edges()) {
      var s = n[a.v],
        d = n[a.w];
      void 0 !== s && void 0 !== d && (d.indegree++, s.out.push(n[a.w]));
    }
    return (function (e) {
      var r = [];
      function n(e) {
        return function (r) {
          r.merged ||
            ((void 0 === r.barycenter ||
              void 0 === e.barycenter ||
              r.barycenter >= e.barycenter) &&
              (function (e, r) {
                var n = 0,
                  t = 0;
                e.weight && ((n += e.barycenter * e.weight), (t += e.weight));
                r.weight && ((n += r.barycenter * r.weight), (t += r.weight));
                (e.vs = r.vs.concat(e.vs)),
                  (e.barycenter = n / t),
                  (e.weight = t),
                  (e.i = Math.min(r.i, e.i)),
                  (r.merged = !0);
              })(e, r));
        };
      }
      function t(r) {
        return function (n) {
          n.in.push(r), 0 == --n.indegree && e.push(n);
        };
      }
      for (; e.length; ) {
        var o = e.pop();
        r.push(o), o.in.reverse().forEach(n(o)), o.out.forEach(t(o));
      }
      return r
        .filter((e) => !e.merged)
        .map(function (e) {
          var r = { vs: e.vs, i: e.i };
          return (
            "barycenter" in e && (r.barycenter = e.barycenter),
            "weight" in e && (r.weight = e.weight),
            r
          );
        });
    })(l(n).filter((e) => !e.indegree));
  }
  var N = "\0";
  class x {
    constructor(e = {}) {
      (this._label = void 0),
        (this._nodeCount = 0),
        (this._edgeCount = 0),
        (this._isDirected = !s(e, "directed") || e.directed),
        (this._isMultigraph = !!s(e, "multigraph") && e.multigraph),
        (this._isCompound = !!s(e, "compound") && e.compound),
        (this._defaultNodeLabelFn = () => {}),
        (this._defaultEdgeLabelFn = () => {}),
        (this._nodes = {}),
        this._isCompound &&
          ((this._parent = {}),
          (this._children = {}),
          (this._children["\0"] = {})),
        (this._in = {}),
        (this._preds = {}),
        (this._out = {}),
        (this._sucs = {}),
        (this._edgeObjs = {}),
        (this._edgeLabels = {});
    }
    isDirected() {
      return this._isDirected;
    }
    isMultigraph() {
      return this._isMultigraph;
    }
    isCompound() {
      return this._isCompound;
    }
    setGraph(e) {
      return (this._label = e), this;
    }
    graph() {
      return this._label;
    }
    setDefaultNodeLabel(e) {
      var r;
      return (
        (r = e),
        (this._defaultNodeLabelFn = "function" != typeof r ? () => e : e),
        this
      );
    }
    nodeCount() {
      return this._nodeCount;
    }
    nodes() {
      return Object.keys(this._nodes);
    }
    sources() {
      var e = this;
      return this.nodes().filter(function (r) {
        return w(e._in[r]);
      });
    }
    sinks() {
      var e = this;
      return this.nodes().filter((r) => w(e._out[r]));
    }
    setNodes(e, r) {
      for (var n of e) void 0 !== r ? this.setNode(n, r) : this.setNode(n);
      return this;
    }
    setNode(e, r) {
      return s(this._nodes, e)
        ? (arguments.length > 1 && (this._nodes[e] = r), this)
        : ((this._nodes[e] =
            arguments.length > 1 ? r : this._defaultNodeLabelFn(e)),
          this._isCompound &&
            ((this._parent[e] = N),
            (this._children[e] = {}),
            (this._children["\0"][e] = !0)),
          (this._in[e] = {}),
          (this._preds[e] = {}),
          (this._out[e] = {}),
          (this._sucs[e] = {}),
          ++this._nodeCount,
          this);
    }
    node(e) {
      return this._nodes[e];
    }
    hasNode(e) {
      return s(this._nodes, e);
    }
    removeNode(e) {
      var r = this;
      if (s(this._nodes, e)) {
        var n = (e) => {
          r.removeEdge(this._edgeObjs[e]);
        };
        if ((delete this._nodes[e], this._isCompound)) {
          for (var t of (this._removeFromParentsChildList(e),
          delete this._parent[e],
          this.children(e)))
            r.setParent(t);
          delete this._children[e];
        }
        for (var o of Object.keys(this._in[e])) n(o);
        for (var o of (delete this._in[e],
        delete this._preds[e],
        Object.keys(this._out[e])))
          n(o);
        delete this._out[e], delete this._sucs[e], --this._nodeCount;
      }
      return this;
    }
    setParent(e, r) {
      if (!this._isCompound)
        throw new Error("Cannot set parent in a non-compound graph");
      if (void 0 === r) r = N;
      else {
        for (var n = (r += ""); !p(n); n = this.parent(n))
          if (n === e)
            throw new Error(
              `Setting ${r} as parent of ${e} would create a cycle`
            );
        this.setNode(r);
      }
      return (
        this.setNode(e),
        this._removeFromParentsChildList(e),
        (this._parent[e] = r),
        (this._children[r][e] = !0),
        this
      );
    }
    _removeFromParentsChildList(e) {
      delete this._children[this._parent[e]][e];
    }
    parent(e) {
      if (this._isCompound) {
        var r = this._parent[e];
        if (r !== N) return r;
      }
    }
    children(e) {
      if ((p(e) && (e = N), this._isCompound)) {
        var r = this._children[e];
        return r ? Object.keys(r) : void 0;
      }
      return e === N ? this.nodes() : this.hasNode(e) ? [] : void 0;
    }
    predecessors(e) {
      var r = this._preds[e];
      if (r) return Object.keys(r);
    }
    successors(e) {
      var r = this._sucs[e];
      if (r) return Object.keys(r);
    }
    neighbors(e) {
      var r = this.predecessors(e);
      if (r)
        return (function (e, r) {
          var n = [...e];
          for (var t of r) -1 === n.indexOf(t) && n.push(t);
          return n;
        })(r, this.successors(e));
    }
    isLeaf(e) {
      return (
        0 ===
        (this.isDirected() ? this.successors(e) : this.neighbors(e)).length
      );
    }
    filterNodes(e) {
      var r = new x({
        directed: this._isDirected,
        multigraph: this._isMultigraph,
        compound: this._isCompound,
      });
      r.setGraph(this.graph());
      var n = this;
      m(this._nodes, function (n, t) {
        e(t) && r.setNode(t, n);
      }),
        m(this._edgeObjs, function (e) {
          r.hasNode(e.v) && r.hasNode(e.w) && r.setEdge(e, n.edge(e));
        });
      var t = {};
      function o(e) {
        var i = n.parent(e);
        return void 0 === i || r.hasNode(i)
          ? ((t[e] = i), i)
          : i in t
          ? t[i]
          : o(i);
      }
      if (this._isCompound) for (var i of r.nodes()) r.setParent(i, o(i));
      return r;
    }
    setDefaultEdgeLabel(e) {
      var r;
      return (
        (r = e),
        (this._defaultEdgeLabelFn = "function" != typeof r ? () => e : e),
        this
      );
    }
    edgeCount() {
      return this._edgeCount;
    }
    edges() {
      return Object.values(this._edgeObjs);
    }
    setPath(e, r) {
      var n = this,
        t = arguments;
      return (
        e.reduce(function (e, o) {
          return t.length > 1 ? n.setEdge(e, o, r) : n.setEdge(e, o), o;
        }),
        this
      );
    }
    setEdge(e, r, n, t) {
      var o = !1,
        i = e;
      "object" == typeof i && null !== i && "v" in i
        ? ((e = i.v),
          (r = i.w),
          (t = i.name),
          2 === arguments.length && ((n = arguments[1]), (o = !0)))
        : ((e = i),
          (r = arguments[1]),
          (t = arguments[3]),
          arguments.length > 2 && ((n = arguments[2]), (o = !0))),
        (e = "" + e),
        (r = "" + r),
        p(t) || (t = "" + t);
      var a = j(this._isDirected, e, r, t);
      if (s(this._edgeLabels, a)) return o && (this._edgeLabels[a] = n), this;
      if (!p(t) && !this._isMultigraph)
        throw new Error("Cannot set a named edge when isMultigraph = false");
      this.setNode(e),
        this.setNode(r),
        (this._edgeLabels[a] = o ? n : this._defaultEdgeLabelFn(e, r, t));
      var d = (function (e, r, n, t) {
        var o = "" + r,
          i = "" + n;
        if (!e && o > i) {
          var a = o;
          (o = i), (i = a);
        }
        var s = { v: o, w: i };
        t && (s.name = t);
        return s;
      })(this._isDirected, e, r, t);
      return (
        (e = d.v),
        (r = d.w),
        Object.freeze(d),
        (this._edgeObjs[a] = d),
        C(this._preds[r], e),
        C(this._sucs[e], r),
        (this._in[r][a] = d),
        (this._out[e][a] = d),
        this._edgeCount++,
        this
      );
    }
    edge(e, r, n) {
      var t =
        "object" == typeof e
          ? M(this._isDirected, e)
          : j(this._isDirected, e, r, n);
      return this._edgeLabels[t];
    }
    hasEdge(e, r, n) {
      var t =
        1 === arguments.length
          ? M(this._isDirected, arguments[0])
          : j(this._isDirected, e, r, n);
      return s(this._edgeLabels, t);
    }
    removeEdge(e, r, n) {
      var t =
          "object" == typeof e
            ? M(this._isDirected, e)
            : j(this._isDirected, e, r, n),
        o = this._edgeObjs[t];
      return (
        o &&
          ((e = o.v),
          (r = o.w),
          delete this._edgeLabels[t],
          delete this._edgeObjs[t],
          O(this._preds[r], e),
          O(this._sucs[e], r),
          delete this._in[r][t],
          delete this._out[e][t],
          this._edgeCount--),
        this
      );
    }
    inEdges(e, r) {
      var n = this._in[e];
      if (n) {
        var t = Object.values(n);
        return r
          ? t.filter(function (e) {
              return e.v === r;
            })
          : t;
      }
    }
    outEdges(e, r) {
      var n = this._out[e];
      if (n) {
        var t = Object.values(n);
        return r
          ? t.filter(function (e) {
              return e.w === r;
            })
          : t;
      }
    }
    nodeEdges(e, r) {
      var n = this.inEdges(e, r);
      if (n) return n.concat(this.outEdges(e, r));
    }
  }
  class I extends x {}
  function C(e, r) {
    e[r] ? e[r]++ : (e[r] = 1);
  }
  function O(e, r) {
    --e[r] || delete e[r];
  }
  function j(e, r, n, t) {
    var o = "" + r,
      i = "" + n;
    if (!e && o > i) {
      var a = o;
      (o = i), (i = a);
    }
    return o + "" + i + "" + (p(t) ? "\0" : t);
  }
  function M(e, r) {
    return j(e, r.v, r.w, r.name);
  }
  function L(e, r, n, t) {
    var o;
    do {
      o = v(t);
    } while (e.hasNode(o));
    return (n.dummy = r), e.setNode(o, n), o;
  }
  function T(e) {
    var r = new x().setGraph(e.graph());
    for (var n of e.nodes()) r.setNode(n, e.node(n));
    for (var t of e.edges()) {
      var o = r.edge(t.v, t.w) || { weight: 0, minlen: 1 },
        i = e.edge(t);
      r.setEdge(t.v, t.w, {
        weight: o.weight + i.weight,
        minlen: Math.max(o.minlen, i.minlen),
      });
    }
    return r;
  }
  function S(e) {
    var r = new x({ multigraph: e.isMultigraph() }).setGraph(e.graph());
    for (var n of e.nodes()) e.children(n).length || r.setNode(n, e.node(n));
    for (var t of e.edges()) r.setEdge(t, e.edge(t));
    return r;
  }
  function P(e, r) {
    var n,
      t,
      o = e.x,
      i = e.y,
      a = r.x - o,
      s = r.y - i,
      d = e.width / 2,
      u = e.height / 2;
    if (!a && !s)
      throw new Error(
        "Not possible to find intersection inside of the rectangle"
      );
    return (
      Math.abs(s) * d > Math.abs(a) * u
        ? (s < 0 && (u = -u), (n = (u * a) / s), (t = u))
        : (a < 0 && (d = -d), (n = d), (t = (d * s) / a)),
      { x: o + n, y: i + t }
    );
  }
  function R(e) {
    var r = g(G(e) + 1, () => []);
    for (var n of e.nodes()) {
      var t = e.node(n),
        o = t.rank;
      void 0 !== o && (r[o][t.order] = n);
    }
    return r;
  }
  function F(e) {
    var r = Math.min(
      ...e
        .nodes()
        .map((r) => e.node(r).rank)
        .filter((e) => void 0 !== e)
    );
    for (var n of e.nodes()) {
      var t = e.node(n);
      s(t, "rank") && (t.rank -= r);
    }
  }
  function D(e) {
    var r = Math.min(
        ...e
          .nodes()
          .map((r) => e.node(r).rank)
          .filter((e) => void 0 !== e)
      ),
      n = [];
    for (var t of e.nodes()) {
      var o = e.node(t).rank - r;
      n[o] || (n[o] = []), n[o].push(t);
    }
    for (var i = 0, a = e.graph().nodeRankFactor, s = 0; s < n.length; s++) {
      var d = n[s];
      if (void 0 === d && s % a != 0) --i;
      else if (i && null != d) for (var t of d) e.node(t).rank += i;
    }
  }
  function z(e, r, n, t) {
    var o = { width: 0, height: 0 };
    return (
      arguments.length >= 4 && ((o.rank = n), (o.order = t)),
      L(e, "border", o, r)
    );
  }
  function G(e) {
    var r = e
      .nodes()
      .map((r) => e.node(r).rank)
      .filter((e) => void 0 !== e);
    return Math.max(...r);
  }
  function V(e, r) {
    var n = [],
      t = [];
    for (var o of e) r(o) ? n.push(o) : t.push(o);
    return { lhs: n, rhs: t };
  }
  function Y(e, r) {
    var n = Date.now();
    try {
      return r();
    } finally {
      console.log(e + " time: " + (Date.now() - n) + "ms");
    }
  }
  function B(e, r) {
    return r();
  }
  var A = Object.freeze({
    __proto__: null,
    addDummyNode: L,
    simplify: T,
    asNonCompoundGraph: S,
    successorWeights: function (e) {
      var r = {};
      for (var n of e.nodes()) {
        var t = {};
        for (var o of e.outEdges(n)) t[o.w] = (t[o.w] || 0) + e.edge(o).weight;
        r[n] = t;
      }
      return r;
    },
    predecessorWeights: function (e) {
      var r = {};
      for (var n of e.nodes()) {
        var t = {};
        for (var o of e.inEdges(n)) t[o.v] = (t[o.v] || 0) + e.edge(o).weight;
        r[n] = t;
      }
      return r;
    },
    intersectRect: P,
    buildLayerMatrix: R,
    normalizeRanks: F,
    removeEmptyRanks: D,
    addBorderNode: z,
    maxRank: G,
    partition: V,
    time: Y,
    notime: B,
  });
  function q(e, r) {
    var n,
      t = V(e, function (e) {
        return s(e, "barycenter");
      }),
      o = t.lhs,
      i = c(t.rhs, (e) => -e.i),
      d = [],
      u = 0,
      f = 0,
      h = 0;
    for (var v of (o.sort(
      ((n = !!r),
      function (e, r) {
        return e.barycenter < r.barycenter
          ? -1
          : e.barycenter > r.barycenter
          ? 1
          : n
          ? r.i - e.i
          : e.i - r.i;
      })
    ),
    (h = W(d, i, h)),
    o))
      (h += v.vs.length),
        d.push(v.vs),
        (u += v.barycenter * v.weight),
        (f += v.weight),
        (h = W(d, i, h));
    var l = { vs: a(d) };
    return f && ((l.barycenter = u / f), (l.weight = f)), l;
  }
  function W(e, r, n) {
    for (var t; r.length && (t = d(r)).i <= n; ) r.pop(), e.push(t.vs), n++;
    return n;
  }
  function $(e, r, n, t) {
    var o = e.children(r),
      i = e.node(r),
      d = i ? i.borderLeft : void 0,
      u = i ? i.borderRight : void 0,
      f = {};
    d && (o = o.filter((e) => e !== d && e !== u));
    var h = k(e, o);
    for (var c of h)
      if (e.children(c.v).length) {
        var v = $(e, c.v, n, t);
        (f[c.v] = v), s(v, "barycenter") && J(c, v);
      }
    var l = E(h, n);
    !(function (e, r) {
      for (var n of e)
        n.vs = a(
          n.vs.map(function (e) {
            return r[e] ? r[e].vs : [e];
          })
        );
    })(l, f);
    var g = q(l, t);
    if (d && ((g.vs = [d, ...g.vs, u]), e.predecessors(d).length)) {
      var p = e.node(e.predecessors(d)[0]),
        m = e.node(e.predecessors(u)[0]);
      s(g, "barycenter") || ((g.barycenter = 0), (g.weight = 0)),
        (g.barycenter =
          (g.barycenter * g.weight + p.order + m.order) / (g.weight + 2)),
        (g.weight += 2);
    }
    return g;
  }
  function J(e, r) {
    void 0 !== e.barycenter
      ? ((e.barycenter =
          (e.barycenter * e.weight + r.barycenter * r.weight) /
          (e.weight + r.weight)),
        (e.weight += r.weight))
      : ((e.barycenter = r.barycenter), (e.weight = r.weight));
  }
  function Q(e, r, n) {
    var t = (function (e) {
        var r;
        for (; e.hasNode((r = v("_root"))); );
        return r;
      })(e),
      o = new x({ compound: !0 })
        .setGraph({ root: t })
        .setDefaultNodeLabel((r) => e.node(r));
    for (var i of e.nodes()) {
      var a = e.node(i),
        d = e.parent(i);
      if (a.rank === r || (a.minRank <= r && r <= a.maxRank)) {
        for (var u of (o.setNode(i), o.setParent(i, d || t), e[n](i))) {
          var f = u.v === i ? u.w : u.v,
            h = o.edge(f, i),
            c = void 0 !== h ? h.weight : 0;
          o.setEdge(f, i, { weight: e.edge(u).weight + c });
        }
        s(a, "minRank") &&
          o.setNode(i, {
            borderLeft: a.borderLeft[r],
            borderRight: a.borderRight[r],
          });
      }
    }
    return o;
  }
  function K(e, r, n) {
    var t,
      o = {};
    for (var i of n)
      !(function () {
        for (var n, a = e.parent(i); a; ) {
          var s = e.parent(a);
          if ((s ? ((n = o[s]), (o[s] = a)) : ((n = t), (t = a)), n && n !== a))
            return void r.setEdge(n, a);
          a = s;
        }
      })();
  }
  function X(e) {
    var r = G(e),
      n = H(e, h(1, r + 1), "inEdges"),
      t = H(e, h(r - 1, -1), "outEdges"),
      o = _(e);
    Z(e, o);
    for (var i, a = Number.POSITIVE_INFINITY, s = 0, d = 0; d < 4; ++s, ++d) {
      U(s % 2 ? n : t, s % 4 >= 2);
      var u = b(e, (o = R(e)));
      u < a && ((d = 0), (i = o.map((e) => e.slice(0))), (a = u));
    }
    Z(e, i);
  }
  function H(e, r, n) {
    return r.map((r) => Q(e, r, n));
  }
  function U(e, r) {
    var n = new x();
    for (var t of e) {
      var o = t.graph().root,
        i = $(t, o, n, r);
      i.vs.map(function (e, r) {
        t.node(e).order = r;
      }),
        K(t, n, i.vs);
    }
  }
  function Z(e, r) {
    for (var n of r)
      n.map(function (r, n) {
        e.node(r).order = n;
      });
  }
  var ee = Object.freeze({
    __proto__: null,
    order: X,
    addSubgraphConstraints: K,
    barycenter: k,
    buildLayerGraph: Q,
    crossCount: b,
    initOrder: _,
    resolveConflicts: E,
    sortSubgraph: $,
    sort: q,
  });
  function re(e, r) {
    var n = {};
    return (
      r.reduce(function (r, t) {
        for (
          var o = 0, i = 0, a = r.length, s = d(t), u = 0;
          u < t.length;
          u++
        ) {
          var f = t[u],
            h = te(e, f),
            c = h ? e.node(h).order : a;
          if (h || f === s) {
            for (var v of t.slice(i, u + 1))
              for (var l of e.predecessors(v)) {
                var g = e.node(l),
                  p = g.order;
                !(p < o || c < p) ||
                  (g.dummy && e.node(v).dummy) ||
                  oe(n, l, v);
              }
            (i = u + 1), (o = c);
          }
        }
        return t;
      }),
      n
    );
  }
  function ne(e, r) {
    var n = {};
    function t(r, t, o, i, a) {
      var s;
      for (var d of h(t, o))
        if (((s = r[d]), e.node(s).dummy))
          for (var u of e.predecessors(s)) {
            var f = e.node(u);
            f.dummy && (f.order < i || f.order > a) && oe(n, u, s);
          }
    }
    return (
      r.reduce(function (r, n) {
        for (var o, i = -1, a = 0, s = 0; s < n.length; s++) {
          var d = s,
            u = n[s];
          if (void 0 !== u) {
            if ("border" === e.node(u).dummy) {
              var f = e.predecessors(u);
              f.length &&
                (t(n, a, d, i, (o = e.node(f[0]).order)), (a = d), (i = o));
            }
            t(n, a, n.length, o, r.length);
          }
        }
        return n;
      }),
      n
    );
  }
  function te(e, r) {
    if (e.node(r).dummy)
      for (var n of e.predecessors(r)) if (e.node(n).dummy) return n;
  }
  function oe(e, r, n) {
    if (r > n) {
      var t = r;
      (r = n), (n = t);
    }
    var o = e[r];
    o || (e[r] = o = {}), (o[n] = !0);
  }
  function ie(e, r, n) {
    if (r > n) {
      var t = r;
      (r = n), (n = t);
    }
    return s(e[r], n);
  }
  function ae(e, r, n, t) {
    var o = {},
      i = {},
      a = {};
    for (var s of r)
      for (var d = 0; d < s.length; d++) {
        (o[(f = s[d])] = f), (i[f] = f), (a[f] = d);
      }
    for (var s of r) {
      var u = -1;
      for (var f of s) {
        var h = t(f);
        if (h.length)
          for (
            var v = ((h = c(h, (e) => a[e])).length - 1) / 2,
              l = Math.floor(v),
              g = Math.ceil(v);
            l <= g;
            ++l
          ) {
            var p = h[l];
            i[f] === f &&
              u < a[p] &&
              !ie(n, f, p) &&
              ((i[p] = f), (i[f] = o[f] = o[p]), (u = a[p]));
          }
      }
    }
    return { root: o, align: i };
  }
  function se(e, r, n, t, o) {
    var i = {},
      a = (function (e, r, n, t) {
        var o = new x(),
          i = e.graph(),
          a = ce(i.nodesep, i.edgesep, t);
        for (var s of r) {
          var d = null;
          for (var u of s) {
            var f = n[u];
            if ((o.setNode(f), d)) {
              var h = n[d],
                c = o.edge(h, f);
              o.setEdge(h, f, Math.max(a(e, u, d), c || 0));
            }
            d = u;
          }
        }
        return o;
      })(e, r, n, o),
      s = o ? "borderLeft" : "borderRight";
    function d(e, r) {
      for (var n = a.nodes(), t = n.pop(), o = {}; t; )
        o[t] ? e(t) : ((o[t] = !0), n.push(t), (n = n.concat(r(t)))),
          (t = n.pop());
    }
    for (var u of (d(
      function (e) {
        i[e] = a.inEdges(e).reduce(function (e, r) {
          return Math.max(e, i[r.v] + a.edge(r));
        }, 0);
      },
      (e) => a.predecessors(e)
    ),
    d(
      function (r) {
        var n = a.outEdges(r).reduce(function (e, r) {
            return Math.min(e, i[r.w] - a.edge(r));
          }, Number.POSITIVE_INFINITY),
          t = e.node(r);
        n !== Number.POSITIVE_INFINITY &&
          t.borderType !== s &&
          (i[r] = Math.max(i[r], n));
      },
      (e) => a.successors(e)
    ),
    Object.keys(t))) {
      var f = t[u];
      i[f] = i[n[f]];
    }
    return i;
  }
  function de(e, r) {
    return f(l(r), function (r) {
      var n = Number.NEGATIVE_INFINITY,
        t = Number.POSITIVE_INFINITY;
      for (var o in r) {
        var i = r[o],
          a = ve(e, o) / 2;
        (n = Math.max(i + a, n)), (t = Math.min(i - a, t));
      }
      return n - t;
    });
  }
  function ue(e, r) {
    var n = l(r),
      t = Math.min(...n),
      o = Math.max(...n);
    for (var i of ["ul", "ur", "dl", "dr"]) {
      var a = i[1],
        s = e[i];
      if (s !== r) {
        var d = l(s),
          f = "l" === a ? t - Math.min(...d) : o - Math.max(...d);
        f && (e[i] = u(s, (e) => e + f));
      }
    }
  }
  function fe(e, r) {
    return u(e.ul, function (n, t) {
      if (r) return e[r.toLowerCase()][t];
      var o = c([e.ul[t], e.ur[t], e.dl[t], e.dr[t]], (e) => e);
      return (o[1] + o[2]) / 2;
    });
  }
  function he(e) {
    var r,
      n = R(e),
      t = Object.assign(Object.assign({}, re(e, n)), ne(e, n)),
      o = { ul: {}, ur: {}, dl: {}, dr: {} };
    for (var i of ["u", "d"])
      for (var a of ((r = "u" === i ? n : n.map((e) => e).reverse()),
      ["l", "r"])) {
        "r" === a && (r = r.map((e) => e.map((e) => e).reverse()));
        var s = ae(
            0,
            r,
            t,
            ("u" === i ? e.predecessors : e.successors).bind(e)
          ),
          d = se(e, r, s.root, s.align, "r" === a);
        "r" === a && (d = u(d, (e) => -e)), (o[i + a] = d);
      }
    return ue(o, de(e, o)), fe(o, e.graph().align);
  }
  function ce(e, r, n) {
    return function (t, o, i) {
      var a,
        d = t.node(o),
        u = t.node(i),
        f = 0;
      if (((f += d.width / 2), s(d, "labelpos")))
        switch (d.labelpos.toLowerCase()) {
          case "l":
            a = -d.width / 2;
            break;
          case "r":
            a = d.width / 2;
        }
      if (
        (a && (f += n ? a : -a),
        (a = 0),
        (f += (d.dummy ? r : e) / 2),
        (f += (u.dummy ? r : e) / 2),
        (f += u.width / 2),
        s(u, "labelpos"))
      )
        switch (u.labelpos.toLowerCase()) {
          case "l":
            a = u.width / 2;
            break;
          case "r":
            a = -u.width / 2;
        }
      return a && (f += n ? a : -a), (a = 0), f;
    };
  }
  function ve(e, r) {
    return e.node(r).width;
  }
  var le = Object.freeze({
    __proto__: null,
    findType1Conflicts: re,
    findType2Conflicts: ne,
    findOtherInnerSegmentNode: te,
    addConflict: oe,
    hasConflict: ie,
    verticalAlignment: ae,
    horizontalCompaction: se,
    findSmallestWidthAlignment: de,
    alignCoordinates: ue,
    balance: fe,
    positionX: he,
    sep: ce,
    width: ve,
  });
  function ge(e) {
    !(function (e) {
      var r = R(e),
        n = e.graph().ranksep,
        t = 0;
      for (var o of r) {
        var i = Math.max(...o.map((r) => e.node(r).height));
        for (var a of o) e.node(a).y = t + i / 2;
        t += i + n;
      }
    })((e = S(e)));
    var r = he(e);
    for (var n in r) e.node(n).x = r[n];
  }
  var pe = Object.freeze({ __proto__: null, bk: le, position: ge });
  function me(e) {
    var r = {};
    e.sources().forEach(function n(t) {
      var o = e.node(t);
      if (s(r, t)) return o.rank;
      r[t] = !0;
      var i = Math.min(...e.outEdges(t).map((r) => n(r.w) - e.edge(r).minlen));
      return (
        (i !== Number.POSITIVE_INFINITY && null != i) || (i = 0), (o.rank = i)
      );
    });
  }
  function we(e, r) {
    return e.node(r.w).rank - e.node(r.v).rank - e.edge(r).minlen;
  }
  function _e(e) {
    var r,
      n = new x({ directed: !1 }),
      t = e.nodes()[0],
      o = e.nodeCount();
    for (n.setNode(t, {}); i(e) < o; )
      (r = a(e)), s(e, n.hasNode(r.v) ? we(e, r) : -we(e, r));
    return n;
    function i(e) {
      return (
        n.nodes().forEach(function r(t) {
          for (var o of e.nodeEdges(t)) {
            var i = o.v,
              a = t === i ? o.w : i;
            n.hasNode(a) ||
              we(e, o) ||
              (n.setNode(a, {}), n.setEdge(t, a, {}), r(a));
          }
        }),
        n.nodeCount()
      );
    }
    function a(e) {
      return f(e.edges(), function (r) {
        if (n.hasNode(r.v) !== n.hasNode(r.w)) return we(e, r);
      });
    }
    function s(e, r) {
      for (var t of n.nodes()) e.node(t).rank += r;
    }
  }
  class be {
    constructor() {
      (this._arr = []), (this._keyIndices = {});
    }
    size() {
      return this._arr.length;
    }
    keys() {
      return this._arr.map(function (e) {
        return e.key;
      });
    }
    has(e) {
      return e in this._keyIndices;
    }
    priority(e) {
      var r = this._keyIndices[e];
      if (void 0 !== r) return this._arr[r].priority;
    }
    min() {
      if (0 === this.size()) throw new Error("Queue underflow");
      return this._arr[0].key;
    }
    add(e, r) {
      var n = this._keyIndices;
      if (!((e = String(e)) in n)) {
        var t = this._arr,
          o = t.length;
        return (
          (n[e] = o), t.push({ key: e, priority: r }), this._decrease(o), !0
        );
      }
      return !1;
    }
    removeMin() {
      this._swap(0, this._arr.length - 1);
      var e = this._arr.pop();
      return delete this._keyIndices[e.key], this._heapify(0), e.key;
    }
    decrease(e, r) {
      var n = this._keyIndices[e];
      if (r > this._arr[n].priority)
        throw new Error(
          "New priority is greater than current priority. Key: " +
            e +
            " Old: " +
            this._arr[n].priority +
            " New: " +
            r
        );
      (this._arr[n].priority = r), this._decrease(n);
    }
    _heapify(e) {
      var r = this._arr,
        n = 2 * e,
        t = n + 1,
        o = e;
      n < r.length &&
        ((o = r[n].priority < r[o].priority ? n : o),
        t < r.length && (o = r[t].priority < r[o].priority ? t : o),
        o !== e && (this._swap(e, o), this._heapify(o)));
    }
    _decrease(e) {
      for (
        var r, n = this._arr, t = n[e].priority;
        0 !== e && !(n[(r = e >> 1)].priority < t);

      )
        this._swap(e, r), (e = r);
    }
    _swap(e, r) {
      var n = this._arr,
        t = this._keyIndices,
        o = n[e],
        i = n[r];
      (n[e] = i), (n[r] = o), (t[i.key] = e), (t[o.key] = r);
    }
  }
  var ye = () => 1;
  function ke(e, r, n, t) {
    return (function (e, r, n, t) {
      var o,
        i,
        a = {},
        s = new be(),
        d = function (e) {
          var r = e.v !== o ? e.v : e.w,
            t = a[r],
            d = n(e),
            u = i.distance + d;
          if (d < 0)
            throw new Error(
              "dijkstra does not allow negative edge weights. Bad edge: " +
                e +
                " Weight: " +
                d
            );
          u < t.distance &&
            ((t.distance = u), (t.predecessor = o), s.decrease(r, u));
        };
      e.nodes().forEach(function (e) {
        var n = e === r ? 0 : Number.POSITIVE_INFINITY;
        (a[e] = { distance: n }), s.add(e, n);
      });
      for (
        ;
        s.size() > 0 &&
        ((o = s.removeMin()), (i = a[o]).distance !== Number.POSITIVE_INFINITY);

      )
        t(o).forEach(d);
      return a;
    })(
      e,
      String(r),
      n || ye,
      t ||
        function (r) {
          return e.outEdges(r);
        }
    );
  }
  function Ee(e) {
    var r = 0,
      n = [],
      t = {},
      o = [];
    function i(a) {
      var s = (t[a] = { onStack: !0, lowlink: r, index: r++ });
      if (
        (n.push(a),
        e.successors(a).forEach(function (e) {
          e in t
            ? t[e].onStack && (s.lowlink = Math.min(s.lowlink, t[e].index))
            : (i(e), (s.lowlink = Math.min(s.lowlink, t[e].lowlink)));
        }),
        s.lowlink === s.index)
      ) {
        var d,
          u = [];
        do {
          (d = n.pop()), (t[d].onStack = !1), u.push(d);
        } while (a !== d);
        o.push(u);
      }
    }
    return (
      e.nodes().forEach(function (e) {
        e in t || i(e);
      }),
      o
    );
  }
  var Ne = () => 1;
  class xe extends Error {}
  function Ie(e) {
    var r = {},
      n = {},
      t = [];
    function o(i) {
      if (i in n) throw new xe();
      if (!(i in r)) {
        for (var a of ((n[i] = !0), (r[i] = !0), e.predecessors(i))) o(a);
        delete n[i], t.push(i);
      }
    }
    for (var i of e.sinks()) o(i);
    if (Object.keys(r).length !== e.nodeCount()) throw new xe();
    return t;
  }
  function Ce(e, r, n) {
    var t = Array.isArray(r) ? r : [r],
      o = (e.isDirected() ? e.successors : e.neighbors).bind(e),
      i = [],
      a = {};
    for (var s of t) {
      if (!e.hasNode(s)) throw new Error("Graph does not have node: " + s);
      Oe(e, s, "post" === n, a, o, i);
    }
    return i;
  }
  function Oe(e, r, n, t, o, i) {
    if (!(r in t)) {
      for (var a of ((t[r] = !0), n || i.push(r), o(r))) Oe(e, a, n, t, o, i);
      n && i.push(r);
    }
  }
  function je(e, r) {
    return Ce(e, r, "post");
  }
  function Me(e, r) {
    return Ce(e, r, "pre");
  }
  var Le = Object.freeze({
    __proto__: null,
    components: function (e) {
      var r,
        n = {},
        t = [];
      function o(t) {
        if (!(t in n)) {
          for (var i of ((n[t] = !0), r.push(t), e.successors(t))) o(i);
          for (var a of e.predecessors(t)) o(a);
        }
      }
      for (var i of e.nodes()) (r = []), o(i), r.length && t.push(r);
      return t;
    },
    dijkstra: ke,
    dijkstraAll: function (e, r, n) {
      var t = {};
      for (var o of e.nodes()) t[o] = ke(e, o, r, n);
      return t;
    },
    findCycles: function (e) {
      return Ee(e).filter(function (r) {
        return r.length > 1 || (1 === r.length && e.hasEdge(r[0], r[0]));
      });
    },
    floydWarshall: function (e, r, n) {
      return (function (e, r, n) {
        var t = {},
          o = e.nodes();
        return (
          o.forEach(function (e) {
            (t[e] = {}),
              (t[e][e] = { distance: 0 }),
              o.forEach(function (r) {
                e !== r && (t[e][r] = { distance: Number.POSITIVE_INFINITY });
              }),
              n(e).forEach(function (n) {
                var o = n.v === e ? n.w : n.v,
                  i = r(n);
                t[e][o] = { distance: i, predecessor: e };
              });
          }),
          o.forEach(function (e) {
            var r = t[e];
            o.forEach(function (n) {
              var i = t[n];
              o.forEach(function (n) {
                var t = i[e],
                  o = r[n],
                  a = i[n],
                  s = t.distance + o.distance;
                s < a.distance &&
                  ((a.distance = s), (a.predecessor = o.predecessor));
              });
            });
          }),
          t
        );
      })(
        e,
        r || Ne,
        n ||
          function (r) {
            return e.outEdges(r);
          }
      );
    },
    isAcyclic: function (e) {
      try {
        Ie(e);
      } catch (e) {
        if (e instanceof xe) return !1;
        throw e;
      }
      return !0;
    },
    postorder: je,
    preorder: Me,
    prim: function (e, r) {
      var n,
        t = new I({}),
        o = {},
        i = new be();
      function a(e) {
        var t = e.v === n ? e.w : e.v,
          a = i.priority(t);
        if (void 0 !== a) {
          var s = r(e);
          s < a && ((o[t] = n), i.decrease(t, s));
        }
      }
      if (0 === e.nodeCount()) return t;
      for (n of e.nodes()) i.add(n, Number.POSITIVE_INFINITY), t.setNode(n);
      i.decrease(e.nodes()[0], 0);
      for (var s = !1; i.size() > 0; ) {
        if ((n = i.removeMin()) in o) t.setEdge(n, o[n]);
        else {
          if (s) throw new Error("Input graph is not connected: " + e);
          s = !0;
        }
        e.nodeEdges(n).forEach(a);
      }
      return t;
    },
    tarjan: Ee,
    topsort: Ie,
  });
  function Te(e) {
    me((e = T(e)));
    var r,
      n = _e(e);
    for (Fe(n), Se(n, e); (r = ze(n)); ) Ve(n, e, r, Ge(n, e, r));
  }
  function Se(e, r) {
    var n = je(e, e.nodes());
    for (var t of (n = n.slice(0, n.length - 1))) Pe(e, r, t);
  }
  function Pe(e, r, n) {
    var t = e.node(n).parent;
    e.edge(n, t).cutvalue = Re(e, r, n);
  }
  function Re(e, r, n) {
    var t,
      o,
      i = e.node(n).parent,
      a = !0,
      s = r.edge(n, i),
      d = 0;
    for (var u of (s || ((a = !1), (s = r.edge(i, n))),
    (d = s.weight),
    r.nodeEdges(n))) {
      var f = u.v === n,
        h = f ? u.w : u.v;
      if (h !== i) {
        var c = f === a,
          v = r.edge(u).weight;
        if (((d += c ? v : -v), (t = n), (o = h), e.hasEdge(t, o))) {
          var l = e.edge(n, h).cutvalue;
          d += c ? -l : l;
        }
      }
    }
    return d;
  }
  function Fe(e, r) {
    arguments.length < 2 && (r = e.nodes()[0]), De(e, {}, 1, r);
  }
  function De(e, r, n, t, o) {
    var i = n,
      a = e.node(t);
    for (var d of ((r[t] = !0), e.neighbors(t)))
      s(r, d) || (n = De(e, r, n, d, t));
    return (a.low = i), (a.lim = n++), o ? (a.parent = o) : delete a.parent, n;
  }
  function ze(e) {
    for (var r of e.edges()) if (e.edge(r).cutvalue < 0) return r;
  }
  function Ge(e, r, n) {
    var t = n.v,
      o = n.w;
    r.hasEdge(t, o) || ((t = n.w), (o = n.v));
    var i = e.node(t),
      a = e.node(o),
      s = i,
      d = !1;
    return (
      i.lim > a.lim && ((s = a), (d = !0)),
      f(
        r.edges().filter(function (r) {
          return d === Ye(e, e.node(r.v), s) && d !== Ye(e, e.node(r.w), s);
        }),
        (e) => we(r, e)
      )
    );
  }
  function Ve(e, r, n, t) {
    var o = n.v,
      i = n.w;
    e.removeEdge(o, i),
      e.setEdge(t.v, t.w, {}),
      Fe(e),
      Se(e, r),
      (function (e, r) {
        var n = (function (e, r) {
            for (var n of e.nodes()) if (!r.node(n).parent) return n;
            return;
          })(e, r),
          t = Me(e, n);
        for (var o of (t = t.slice(1))) {
          var i = e.node(o).parent,
            a = r.edge(o, i),
            s = !1;
          a || ((a = r.edge(i, o)), (s = !0)),
            (r.node(o).rank = r.node(i).rank + (s ? a.minlen : -a.minlen));
        }
      })(e, r);
  }
  function Ye(e, r, n) {
    return n.low <= r.lim && r.lim <= n.lim;
  }
  function Be(e) {
    switch (e.graph().ranker) {
      case "network-simplex":
        We(e);
        break;
      case "tight-tree":
        qe(e);
        break;
      case "longest-path":
        Ae(e);
        break;
      default:
        We(e);
    }
  }
  (Te.initLowLimValues = Fe),
    (Te.initCutValues = Se),
    (Te.calcCutValue = Re),
    (Te.leaveEdge = ze),
    (Te.enterEdge = Ge),
    (Te.exchangeEdges = Ve);
  var Ae = me;
  function qe(e) {
    me(e), _e(e);
  }
  function We(e) {
    Te(e);
  }
  var $e = Object.freeze({
      __proto__: null,
      rank: Be,
      tightTreeRanker: qe,
      networkSimplexRanker: We,
      networkSimplex: Te,
      feasibleTree: _e,
      longestPath: me,
    }),
    Je = (e) => 1;
  function Qe(e, n) {
    if (e.nodeCount() <= 1) return [];
    var t = (function (e, n) {
      var t = new x(),
        o = 0,
        i = 0;
      for (var a of e.nodes()) t.setNode(a, { v: a, in: 0, out: 0 });
      for (var s of e.edges()) {
        var d = t.edge(s.v, s.w) || 0,
          u = n(s),
          f = d + u;
        t.setEdge(s.v, s.w, f),
          (i = Math.max(i, (t.node(s.v).out += u))),
          (o = Math.max(o, (t.node(s.w).in += u)));
      }
      var h = g(i + o + 3, () => new r()),
        c = o + 1;
      for (var a of t.nodes()) Xe(h, c, t.node(a));
      return { graph: t, buckets: h, zeroIdx: c };
    })(e, n || Je);
    return a(
      (function (e, r, n) {
        var t,
          o = [],
          i = r[r.length - 1],
          a = r[0];
        for (; e.nodeCount(); ) {
          for (; (t = a.dequeue()); ) Ke(e, r, n, t);
          for (; (t = i.dequeue()); ) Ke(e, r, n, t);
          if (e.nodeCount())
            for (var s = r.length - 2; s > 0; --s)
              if ((t = r[s].dequeue())) {
                o = o.concat(Ke(e, r, n, t, !0));
                break;
              }
        }
        return o;
      })(t.graph, t.buckets, t.zeroIdx).map((r) => e.outEdges(r.v, r.w))
    );
  }
  function Ke(e, r, n, t, o) {
    var i = o ? [] : void 0;
    for (var a of e.inEdges(t.v)) {
      var s = e.edge(a),
        d = e.node(a.v);
      o && i.push({ v: a.v, w: a.w }), (d.out -= s), Xe(r, n, d);
    }
    for (var a of e.outEdges(t.v)) {
      s = e.edge(a);
      var u = a.w,
        f = e.node(u);
      (f.in -= s), Xe(r, n, f);
    }
    return e.removeNode(t.v), i;
  }
  function Xe(e, r, n) {
    n.out
      ? n.in
        ? e[n.out - n.in + r].enqueue(n)
        : e[e.length - 1].enqueue(n)
      : e[0].enqueue(n);
  }
  var He = {
    run: function (e) {
      var r =
        "greedy" === e.graph().acyclicer
          ? Qe(
              e,
              (function (e) {
                return function (r) {
                  return e.edge(r).weight;
                };
              })(e)
            )
          : (function (e) {
              var r = [],
                n = {},
                t = {};
              function o(i) {
                if (!s(t, i)) {
                  for (var a of ((t[i] = !0), (n[i] = !0), e.outEdges(i)))
                    s(n, a.w) ? r.push(a) : o(a.w);
                  delete n[i];
                }
              }
              return e.nodes().forEach(o), r;
            })(e);
      for (var n of r) {
        var t = e.edge(n);
        e.removeEdge(n),
          (t.forwardName = n.name),
          (t.reversed = !0),
          e.setEdge(n.w, n.v, t, v("rev"));
      }
    },
    undo: function (e) {
      for (var r of e.edges()) {
        var n = e.edge(r);
        if (n.reversed) {
          e.removeEdge(r);
          var t = n.forwardName;
          delete n.reversed, delete n.forwardName, e.setEdge(r.w, r.v, n, t);
        }
      }
    },
  };
  function Ue(e) {
    e.children().forEach(function r(n) {
      var t = e.children(n),
        o = e.node(n);
      if ((t.length && t.forEach(r), s(o, "minRank"))) {
        (o.borderLeft = []), (o.borderRight = []);
        for (var i = o.minRank, a = o.maxRank + 1; i < a; ++i)
          Ze(e, "borderLeft", "_bl", n, o, i),
            Ze(e, "borderRight", "_br", n, o, i);
      }
    });
  }
  function Ze(e, r, n, t, o, i) {
    var a = { width: 0, height: 0, rank: i, borderType: r },
      s = o[r][i - 1],
      d = L(e, "border", a, n);
    (o[r][i] = d), e.setParent(d, t), s && e.setEdge(s, d, { weight: 1 });
  }
  var er = {
    adjust: function (e) {
      var r = e.graph().rankdir.toLowerCase();
      ("lr" !== r && "rl" !== r) || rr(e);
    },
    undo: function (e) {
      var r = e.graph().rankdir.toLowerCase();
      ("bt" !== r && "rl" !== r) ||
        (function (e) {
          for (var r of e.nodes()) tr(e.node(r));
          for (var n of e.edges()) {
            var t = e.edge(n);
            t.points.forEach(tr), s(t, "y") && tr(t);
          }
        })(e);
      ("lr" !== r && "rl" !== r) ||
        (!(function (e) {
          for (var r of e.nodes()) or(e.node(r));
          for (var n of e.edges()) {
            var t = e.edge(n);
            t.points.forEach(or), s(t, "x") && or(t);
          }
        })(e),
        rr(e));
    },
  };
  function rr(e) {
    for (var r of e.nodes()) nr(e.node(r));
    for (var n of e.edges()) nr(e.edge(n));
  }
  function nr(e) {
    var r = e.width;
    (e.width = e.height), (e.height = r);
  }
  function tr(e) {
    e.y = -e.y;
  }
  function or(e) {
    var r = e.x;
    (e.x = e.y), (e.y = r);
  }
  var ir = Object.freeze({
      __proto__: null,
      debugOrdering: function (e) {
        var r = R(e),
          n = new x({ compound: !0, multigraph: !0 }).setGraph({});
        for (var t of e.nodes())
          n.setNode(t, { label: t }), n.setParent(t, "layer" + e.node(t).rank);
        for (var o of e.edges()) n.setEdge(o.v, o.w, {}, o.name);
        var i = 0;
        for (var a of r) {
          var s = "layer" + i;
          i++,
            n.setNode(s, { rank: "same" }),
            a.reduce(function (e, r) {
              return n.setEdge(e.toString(), r, { style: "invis" }), r;
            });
        }
        return n;
      },
    }),
    ar = {
      run: function (e) {
        for (var r of ((e.graph().dummyChains = []), e.edges())) sr(e, r);
      },
      undo: function (e) {
        for (var r of e.graph().dummyChains) {
          var n,
            t = e.node(r),
            o = t.edgeLabel;
          for (e.setEdge(t.edgeObj, o); t.dummy; )
            (n = e.successors(r)[0]),
              e.removeNode(r),
              o.points.push({ x: t.x, y: t.y }),
              "edge-label" === t.dummy &&
                ((o.x = t.x),
                (o.y = t.y),
                (o.width = t.width),
                (o.height = t.height)),
              (r = n),
              (t = e.node(r));
        }
      },
    };
  function sr(e, r) {
    var n = r.v,
      t = e.node(n).rank,
      o = r.w,
      i = e.node(o).rank,
      a = r.name,
      s = e.edge(r),
      d = s.labelRank;
    if (i !== t + 1) {
      var u, f, h;
      for (e.removeEdge(r), h = 0, ++t; t < i; ++h, ++t)
        (s.points = []),
          (u = L(
            e,
            "edge",
            (f = { width: 0, height: 0, edgeLabel: s, edgeObj: r, rank: t }),
            "_d"
          )),
          t === d &&
            ((f.width = s.width),
            (f.height = s.height),
            (f.dummy = "edge-label"),
            (f.labelpos = s.labelpos)),
          e.setEdge(n, u, { weight: s.weight }, a),
          0 === h && e.graph().dummyChains.push(u),
          (n = u);
      e.setEdge(n, o, { weight: s.weight }, a);
    }
  }
  function dr(e) {
    var r = (function (e) {
      var r = {},
        n = 0;
      function t(o) {
        var i = n;
        e.children(o).forEach(t), (r[o] = { low: i, lim: n++ });
      }
      return e.children().forEach(t), r;
    })(e);
    for (var n of e.graph().dummyChains)
      for (
        var t = e.node(n),
          o = t.edgeObj,
          i = ur(e, r, o.v, o.w),
          a = i.path,
          s = i.lca,
          d = 0,
          u = a[d],
          f = !0;
        n !== o.w;

      ) {
        if (((t = e.node(n)), f)) {
          for (; (u = a[d]) !== s && e.node(u).maxRank < t.rank; ) d++;
          u === s && (f = !1);
        }
        if (!f) {
          for (; d < a.length - 1 && e.node((u = a[d + 1])).minRank <= t.rank; )
            d++;
          u = a[d];
        }
        e.setParent(n, u), (n = e.successors(n)[0]);
      }
  }
  function ur(e, r, n, t) {
    var o,
      i,
      a = [],
      s = [],
      d = Math.min(r[n].low, r[t].low),
      u = Math.max(r[n].lim, r[t].lim);
    o = n;
    do {
      (o = e.parent(o)), a.push(o);
    } while (o && (r[o].low > d || u > r[o].lim));
    for (i = o, o = t; (o = e.parent(o)) !== i; ) s.push(o);
    return { path: a.concat(s.reverse()), lca: i };
  }
  var fr = {
    run: function (e) {
      var r = L(e, "root", {}, "_root"),
        n = (function (e) {
          var r = {};
          function n(t, o) {
            var i = e.children(t);
            if (i && i.length) for (var a of i) n(a, o + 1);
            r[t] = o;
          }
          for (var t of e.children()) n(t, 1);
          return r;
        })(e),
        t = Math.max(...l(n)) - 1,
        o = 2 * t + 1;
      for (var i of ((e.graph().nestingRoot = r), e.edges()))
        e.edge(i).minlen *= o;
      var a =
        (function (e) {
          return e.edges().reduce((r, n) => r + e.edge(n).weight, 0);
        })(e) + 1;
      for (var s of e.children()) hr(e, r, o, a, t, n, s);
      e.graph().nodeRankFactor = o;
    },
    cleanup: function (e) {
      var r = e.graph();
      for (var n of (e.removeNode(r.nestingRoot),
      delete r.nestingRoot,
      e.edges())) {
        e.edge(n).nestingEdge && e.removeEdge(n);
      }
    },
  };
  function hr(e, r, n, t, o, i, a) {
    var s = e.children(a);
    if (s.length) {
      var d = z(e, "_bt"),
        u = z(e, "_bb"),
        f = e.node(a);
      for (var h of (e.setParent(d, a),
      (f.borderTop = d),
      e.setParent(u, a),
      (f.borderBottom = u),
      s)) {
        hr(e, r, n, t, o, i, h);
        var c = e.node(h),
          v = c.borderTop ? c.borderTop : h,
          l = c.borderBottom ? c.borderBottom : h,
          g = c.borderTop ? t : 2 * t,
          p = v !== l ? 1 : o - i[a] + 1;
        e.setEdge(d, v, { weight: g, minlen: p, nestingEdge: !0 }),
          e.setEdge(l, u, { weight: g, minlen: p, nestingEdge: !0 });
      }
      e.parent(a) || e.setEdge(r, d, { weight: 0, minlen: o + i[a] });
    } else a !== r && e.setEdge(r, a, { weight: 0, minlen: n });
  }
  function cr(e) {
    return "edge-proxy" == e.dummy;
  }
  function vr(e) {
    return "selfedge" == e.dummy;
  }
  var lr = 50,
    gr = 20,
    pr = 50,
    mr = "tb",
    wr = 1,
    _r = 1,
    br = 0,
    yr = 0,
    kr = 10,
    Er = "r";
  function Nr(e = {}) {
    var r = {};
    for (var n of Object.keys(e)) r[n.toLowerCase()] = e[n];
    return r;
  }
  function xr(e) {
    return e.nodes().map(function (r) {
      var n = e.node(r),
        t = e.parent(r),
        o = { v: r };
      return void 0 !== n && (o.value = n), void 0 !== t && (o.parent = t), o;
    });
  }
  function Ir(e) {
    return e.edges().map(function (r) {
      var n = e.edge(r),
        t = { v: r.v, w: r.w };
      return (
        void 0 !== r.name && (t.name = r.name), void 0 !== n && (t.value = n), t
      );
    });
  }
  var Cr = Object.freeze({
      __proto__: null,
      write: function (e) {
        var r = {
          options: {
            directed: e.isDirected(),
            multigraph: e.isMultigraph(),
            compound: e.isCompound(),
          },
          nodes: xr(e),
          edges: Ir(e),
        };
        return (
          void 0 !== e.graph() &&
            (r.value = JSON.parse(JSON.stringify(e.graph()))),
          r
        );
      },
      read: function (e) {
        var r = new x(e.options).setGraph(e.value);
        for (var n of e.nodes)
          r.setNode(n.v, n.value), n.parent && r.setParent(n.v, n.parent);
        for (var n of e.edges)
          r.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
        return r;
      },
    }),
    Or = { Graph: x, GraphLike: I, alg: Le, json: Cr, PriorityQueue: be };
  (e.Graph = x),
    (e.GraphLike = I),
    (e.PriorityQueue = be),
    (e.acyclic = He),
    (e.addBorderSegments = Ue),
    (e.alg = Le),
    (e.coordinateSystem = er),
    (e.data = o),
    (e.debug = ir),
    (e.graphlib = Or),
    (e.greedyFAS = Qe),
    (e.json = Cr),
    (e.layout = function (e, r) {
      var n = r && r.debugTiming ? Y : B;
      n("layout", function () {
        var r = n("  buildLayoutGraph", function () {
          return (function (e) {
            var r,
              n,
              t,
              o,
              i,
              a,
              s,
              d,
              u,
              f,
              h,
              c,
              v,
              l,
              g,
              p = new x({ multigraph: !0, compound: !0 }),
              m = Nr(e.graph()),
              w = {
                nodesep: null !== (r = m.nodesep) && void 0 !== r ? r : pr,
                edgesep: null !== (n = m.edgesep) && void 0 !== n ? n : gr,
                ranksep: null !== (t = m.ranksep) && void 0 !== t ? t : lr,
                marginx: +(null !== (o = m.marginx) && void 0 !== o ? o : 0),
                marginy: +(null !== (i = m.marginy) && void 0 !== i ? i : 0),
                acyclicer: m.acyclicer,
                ranker:
                  null !== (a = m.ranker) && void 0 !== a
                    ? a
                    : "network-simplex",
                rankdir: null !== (s = m.rankdir) && void 0 !== s ? s : mr,
                align: m.align,
              };
            for (var _ of (p.setGraph(w), e.nodes())) {
              var b = Nr(e.node(_)),
                y = {
                  width: +(null !== (d = b && b.width) && void 0 !== d ? d : 0),
                  height: +(null !== (u = b && b.height) && void 0 !== u
                    ? u
                    : 0),
                };
              p.setNode(_, y), p.setParent(_, e.parent(_));
            }
            for (var k of e.edges()) {
              var E = Nr(e.edge(k)),
                N = {
                  minlen: null !== (f = E.minlen) && void 0 !== f ? f : wr,
                  weight: null !== (h = E.weight) && void 0 !== h ? h : _r,
                  width: null !== (c = E.width) && void 0 !== c ? c : br,
                  height: null !== (v = E.height) && void 0 !== v ? v : yr,
                  labeloffset:
                    null !== (l = E.labeloffset) && void 0 !== l ? l : kr,
                  labelpos: null !== (g = E.labelpos) && void 0 !== g ? g : Er,
                };
              p.setEdge(k, N);
            }
            return p;
          })(e);
        });
        n("  runLayout", function () {
          !(function (e, r) {
            r("    makeSpaceForEdgeLabels", function () {
              !(function (e) {
                var r = e.graph();
                for (var n of ((r.ranksep /= 2), e.edges())) {
                  var t = e.edge(n);
                  (t.minlen *= 2),
                    "c" !== t.labelpos.toLowerCase() &&
                      ("TB" === r.rankdir || "BT" === r.rankdir
                        ? (t.width += t.labeloffset)
                        : (t.height += t.labeloffset));
                }
              })(e);
            }),
              r("    removeSelfEdges", function () {
                !(function (e) {
                  for (var r of e.edges())
                    if (r.v === r.w) {
                      var n = e.node(r.v);
                      n.selfEdges || (n.selfEdges = []),
                        n.selfEdges.push({ e: r, label: e.edge(r) }),
                        e.removeEdge(r);
                    }
                })(e);
              }),
              r("    acyclic", function () {
                He.run(e);
              }),
              r("    nestingGraph.run", function () {
                fr.run(e);
              }),
              r("    rank", function () {
                Be(S(e));
              }),
              r("    injectEdgeLabelProxies", function () {
                !(function (e) {
                  for (var r of e.edges()) {
                    var n = e.edge(r);
                    if (n.width && n.height) {
                      var t = e.node(r.v),
                        o = e.node(r.w);
                      L(
                        e,
                        "edge-proxy",
                        { rank: (o.rank - t.rank) / 2 + t.rank, e: r },
                        "_ep"
                      );
                    }
                  }
                })(e);
              }),
              r("    removeEmptyRanks", function () {
                D(e);
              }),
              r("    nestingGraph.cleanup", function () {
                fr.cleanup(e);
              }),
              r("    normalizeRanks", function () {
                F(e);
              }),
              r("    assignRankMinMax", function () {
                !(function (e) {
                  var r = 0;
                  for (var n of e.nodes()) {
                    var t = e.node(n);
                    t.borderTop &&
                      ((t.minRank = e.node(t.borderTop).rank),
                      (t.maxRank = e.node(t.borderBottom).rank),
                      (r = Math.max(r, t.maxRank)));
                  }
                  e.graph().maxRank = r;
                })(e);
              }),
              r("    removeEdgeLabelProxies", function () {
                !(function (e) {
                  for (var r of e.nodes()) {
                    var n = e.node(r);
                    cr(n) &&
                      ((e.edge(n.e).labelRank = n.rank), e.removeNode(r));
                  }
                })(e);
              }),
              r("    normalize.run", function () {
                ar.run(e);
              }),
              r("    parentDummyChains", function () {
                dr(e);
              }),
              r("    addBorderSegments", function () {
                Ue(e);
              }),
              r("    order", function () {
                X(e);
              }),
              r("    insertSelfEdges", function () {
                !(function (e) {
                  var r,
                    n = R(e);
                  for (var t of n)
                    for (var o = 0, i = 0; i < t.length; i++) {
                      var a = t[i],
                        s = e.node(a);
                      for (var d of ((s.order = i + o),
                      null !== (r = s.selfEdges) && void 0 !== r ? r : []))
                        L(
                          e,
                          "selfedge",
                          {
                            width: d.label.width,
                            height: d.label.height,
                            rank: s.rank,
                            order: i + ++o,
                            e: d.e,
                            label: d.label,
                          },
                          "_se"
                        );
                      delete s.selfEdges;
                    }
                })(e);
              }),
              r("    adjustCoordinateSystem", function () {
                er.adjust(e);
              }),
              r("    position", function () {
                ge(e);
              }),
              r("    positionSelfEdges", function () {
                !(function (e) {
                  for (var r of e.nodes()) {
                    var n = e.node(r);
                    if (vr(n)) {
                      var t = e.node(n.e.v),
                        o = t.x + t.width / 2,
                        i = t.y,
                        a = n.x - o,
                        s = t.height / 2;
                      e.setEdge(n.e, n.label),
                        e.removeNode(r),
                        (n.label.points = [
                          { x: o + (2 * a) / 3, y: i - s },
                          { x: o + (5 * a) / 6, y: i - s },
                          { x: o + a, y: i },
                          { x: o + (5 * a) / 6, y: i + s },
                          { x: o + (2 * a) / 3, y: i + s },
                        ]),
                        (n.label.x = n.x),
                        (n.label.y = n.y);
                    }
                  }
                })(e);
              }),
              r("    removeBorderNodes", function () {
                !(function (e) {
                  for (var r of e.nodes())
                    if (e.children(r).length) {
                      var n = e.node(r),
                        t = e.node(n.borderTop),
                        o = e.node(n.borderBottom),
                        i = e.node(d(n.borderLeft)),
                        a = e.node(d(n.borderRight));
                      (n.width = Math.abs(a.x - i.x)),
                        (n.height = Math.abs(o.y - t.y)),
                        (n.x = i.x + n.width / 2),
                        (n.y = t.y + n.height / 2);
                    }
                  for (var r of e.nodes())
                    "border" === e.node(r).dummy && e.removeNode(r);
                })(e);
              }),
              r("    normalize.undo", function () {
                ar.undo(e);
              }),
              r("    fixupEdgeLabelCoords", function () {
                !(function (e) {
                  for (var r of e.edges()) {
                    var n = e.edge(r);
                    if (s(n, "x"))
                      switch (
                        (("l" !== n.labelpos && "r" !== n.labelpos) ||
                          (n.width -= n.labeloffset),
                        n.labelpos)
                      ) {
                        case "l":
                          n.x -= n.width / 2 + n.labeloffset;
                          break;
                        case "r":
                          n.x += n.width / 2 + n.labeloffset;
                      }
                  }
                })(e);
              }),
              r("    undoCoordinateSystem", function () {
                er.undo(e);
              }),
              r("    translateGraph", function () {
                !(function (e) {
                  var r,
                    n,
                    t,
                    o = Number.POSITIVE_INFINITY,
                    i = 0,
                    a = Number.POSITIVE_INFINITY,
                    d = 0,
                    u = e.graph(),
                    f = null !== (r = u.marginx) && void 0 !== r ? r : 0,
                    h = null !== (n = u.marginy) && void 0 !== n ? n : 0;
                  function c(e) {
                    var r = e.x,
                      n = e.y,
                      t = e.width,
                      s = e.height;
                    (o = Math.min(o, r - t / 2)),
                      (i = Math.max(i, r + t / 2)),
                      (a = Math.min(a, n - s / 2)),
                      (d = Math.max(d, n + s / 2));
                  }
                  for (var v of e.nodes()) c(e.node(v));
                  for (var l of e.edges()) {
                    s((p = e.edge(l)), "x") && c(p);
                  }
                  for (var v of ((o -= f), (a -= h), e.nodes())) {
                    var g = e.node(v);
                    (g.x -= o), (g.y -= a);
                  }
                  for (var l of e.edges()) {
                    var p = e.edge(l);
                    for (var m of null !== (t = p.points) && void 0 !== t
                      ? t
                      : [])
                      (m.x -= o), (m.y -= a);
                    p.hasOwnProperty("x") && (p.x -= o),
                      p.hasOwnProperty("y") && (p.y -= a);
                  }
                  (u.width = i - o + f), (u.height = d - a + h);
                })(e);
              }),
              r("    assignNodeIntersects", function () {
                !(function (e) {
                  for (var r of e.edges()) {
                    var n,
                      t,
                      o = e.edge(r),
                      i = e.node(r.v),
                      a = e.node(r.w);
                    o.points
                      ? ((n = o.points[0]), (t = o.points[o.points.length - 1]))
                      : ((o.points = []), (n = a), (t = i)),
                      o.points.unshift(P(i, n)),
                      o.points.push(P(a, t));
                  }
                })(e);
              }),
              r("    reversePoints", function () {
                !(function (e) {
                  for (var r of e.edges()) {
                    var n = e.edge(r);
                    n.reversed && n.points.reverse();
                  }
                })(e);
              }),
              r("    acyclic.undo", function () {
                He.undo(e);
              });
          })(r, n);
        }),
          n("  updateInputGraph", function () {
            !(function (e, r) {
              for (var n of e.nodes()) {
                var t = e.node(n),
                  o = r.node(n);
                t &&
                  ((t.x = o.x),
                  (t.y = o.y),
                  r.children(n).length &&
                    ((t.width = o.width), (t.height = o.height)));
              }
              for (var i of e.edges()) {
                var a = e.edge(i),
                  d = r.edge(i);
                (a.points = d.points), s(d, "x") && ((a.x = d.x), (a.y = d.y));
              }
              (e.graph().width = r.graph().width),
                (e.graph().height = r.graph().height);
            })(e, r);
          });
      });
    }),
    (e.nestingGraph = fr),
    (e.normalize = ar),
    (e.order = ee),
    (e.parentDummyChains = dr),
    (e.position = pe),
    (e.rank = $e),
    (e.util = A),
    (e.version = "0.1.3"),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
