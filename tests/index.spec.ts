import { parse } from 'acorn'
import { parse as _parse, compileScript } from '@vue/compiler-sfc'

describe('test ast', () => {
  test.skip('transfomr', () => {
    const script = `
    import {a} from 'vue'
    const props = defineProps({
      foo: String
    })
    const bar = 1

    function test(){
      console.log(props.foo+1)
    }
    
    `
    const ast = parse(script, { ecmaVersion: 'latest', sourceType: 'module' })

    expect(ast).toMatchInlineSnapshot(`
      Node {
        "body": [
          Node {
            "end": 26,
            "source": Node {
              "end": 26,
              "raw": "'vue'",
              "start": 21,
              "type": "Literal",
              "value": "vue",
            },
            "specifiers": [
              Node {
                "end": 14,
                "imported": Node {
                  "end": 14,
                  "name": "a",
                  "start": 13,
                  "type": "Identifier",
                },
                "local": Node {
                  "end": 14,
                  "name": "a",
                  "start": 13,
                  "type": "Identifier",
                },
                "start": 13,
                "type": "ImportSpecifier",
              },
            ],
            "start": 5,
            "type": "ImportDeclaration",
          },
          Node {
            "declarations": [
              Node {
                "end": 83,
                "id": Node {
                  "end": 42,
                  "name": "props",
                  "start": 37,
                  "type": "Identifier",
                },
                "init": Node {
                  "arguments": [
                    Node {
                      "end": 82,
                      "properties": [
                        Node {
                          "computed": false,
                          "end": 76,
                          "key": Node {
                            "end": 68,
                            "name": "foo",
                            "start": 65,
                            "type": "Identifier",
                          },
                          "kind": "init",
                          "method": false,
                          "shorthand": false,
                          "start": 65,
                          "type": "Property",
                          "value": Node {
                            "end": 76,
                            "name": "String",
                            "start": 70,
                            "type": "Identifier",
                          },
                        },
                      ],
                      "start": 57,
                      "type": "ObjectExpression",
                    },
                  ],
                  "callee": Node {
                    "end": 56,
                    "name": "defineProps",
                    "start": 45,
                    "type": "Identifier",
                  },
                  "end": 83,
                  "optional": false,
                  "start": 45,
                  "type": "CallExpression",
                },
                "start": 37,
                "type": "VariableDeclarator",
              },
            ],
            "end": 83,
            "kind": "const",
            "start": 31,
            "type": "VariableDeclaration",
          },
          Node {
            "declarations": [
              Node {
                "end": 101,
                "id": Node {
                  "end": 97,
                  "name": "bar",
                  "start": 94,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 101,
                  "raw": "1",
                  "start": 100,
                  "type": "Literal",
                  "value": 1,
                },
                "start": 94,
                "type": "VariableDeclarator",
              },
            ],
            "end": 101,
            "kind": "const",
            "start": 88,
            "type": "VariableDeclaration",
          },
          Node {
            "async": false,
            "body": Node {
              "body": [
                Node {
                  "end": 154,
                  "expression": Node {
                    "arguments": [
                      Node {
                        "end": 153,
                        "left": Node {
                          "computed": false,
                          "end": 151,
                          "object": Node {
                            "end": 147,
                            "name": "props",
                            "start": 142,
                            "type": "Identifier",
                          },
                          "optional": false,
                          "property": Node {
                            "end": 151,
                            "name": "foo",
                            "start": 148,
                            "type": "Identifier",
                          },
                          "start": 142,
                          "type": "MemberExpression",
                        },
                        "operator": "+",
                        "right": Node {
                          "end": 153,
                          "raw": "1",
                          "start": 152,
                          "type": "Literal",
                          "value": 1,
                        },
                        "start": 142,
                        "type": "BinaryExpression",
                      },
                    ],
                    "callee": Node {
                      "computed": false,
                      "end": 141,
                      "object": Node {
                        "end": 137,
                        "name": "console",
                        "start": 130,
                        "type": "Identifier",
                      },
                      "optional": false,
                      "property": Node {
                        "end": 141,
                        "name": "log",
                        "start": 138,
                        "type": "Identifier",
                      },
                      "start": 130,
                      "type": "MemberExpression",
                    },
                    "end": 154,
                    "optional": false,
                    "start": 130,
                    "type": "CallExpression",
                  },
                  "start": 130,
                  "type": "ExpressionStatement",
                },
              ],
              "end": 160,
              "start": 122,
              "type": "BlockStatement",
            },
            "end": 160,
            "expression": false,
            "generator": false,
            "id": Node {
              "end": 120,
              "name": "test",
              "start": 116,
              "type": "Identifier",
            },
            "params": [],
            "start": 107,
            "type": "FunctionDeclaration",
          },
        ],
        "end": 170,
        "sourceType": "module",
        "start": 0,
        "type": "Program",
      }
    `)
  })
  test('transfomr', () => {
    const script = `
    <script setup>
      let a = 1
      const b = 2
    function c() {}
    class d {}
    </script>
    <script>
    let aa = 1
    const bb = 2
    function cc() {}
    class dd {}
    </script>
    `
    const { descriptor } = _parse(script)
    const content = compileScript(descriptor, { id: 'v' })

    expect(content).toMatchInlineSnapshot(`
      {
        "attrs": {
          "setup": true,
        },
        "bindings": {
          "a": "setup-let",
          "aa": "setup-let",
          "b": "setup-const",
          "bb": "setup-const",
          "c": "setup-const",
          "cc": "setup-const",
          "d": "setup-const",
          "dd": "setup-const",
        },
        "content": "let aa = 1
          const bb = 2
          function cc() {}
          class dd {}
          

      export default {
        setup(__props, { expose }) {
        expose();

            let a = 1
            const b = 2
          function c() {}
          class d {}
          
      const __returned__ = { get aa() { return aa }, set aa(v) { aa = v }, bb, cc, dd, get a() { return a }, set a(v) { a = v }, b, c, d }
      Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
      return __returned__
      }

      }",
        "imports": {},
        "loc": {
          "end": {
            "column": 5,
            "line": 7,
            "offset": 93,
          },
          "source": "
            let a = 1
            const b = 2
          function c() {}
          class d {}
          ",
          "start": {
            "column": 19,
            "line": 2,
            "offset": 19,
          },
        },
        "map": SourceMap {
          "file": null,
          "mappings": "AAQI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACd,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AAChB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACpB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACf,CAAC,CAAC,CAAC;;;;;AAXe;AAClB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACf,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACjB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACnB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACd,CAAC,CAAC,CAAC;;;;;;",
          "names": [],
          "sources": [
            "anonymous.vue",
          ],
          "sourcesContent": [
            "
          <script setup>
            let a = 1
            const b = 2
          function c() {}
          class d {}
          </script>
          <script>
          let aa = 1
          const bb = 2
          function cc() {}
          class dd {}
          </script>
          ",
          ],
          "version": 3,
        },
        "scriptAst": [
          Node {
            "declarations": [
              Node {
                "end": 15,
                "id": Node {
                  "end": 11,
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 10,
                      "index": 11,
                      "line": 2,
                    },
                    "filename": undefined,
                    "identifierName": "aa",
                    "start": Position {
                      "column": 8,
                      "index": 9,
                      "line": 2,
                    },
                  },
                  "name": "aa",
                  "start": 9,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 15,
                  "extra": {
                    "raw": "1",
                    "rawValue": 1,
                  },
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 14,
                      "index": 15,
                      "line": 2,
                    },
                    "filename": undefined,
                    "identifierName": undefined,
                    "start": Position {
                      "column": 13,
                      "index": 14,
                      "line": 2,
                    },
                  },
                  "start": 14,
                  "type": "NumericLiteral",
                  "value": 1,
                },
                "loc": SourceLocation {
                  "end": Position {
                    "column": 14,
                    "index": 15,
                    "line": 2,
                  },
                  "filename": undefined,
                  "identifierName": undefined,
                  "start": Position {
                    "column": 8,
                    "index": 9,
                    "line": 2,
                  },
                },
                "start": 9,
                "type": "VariableDeclarator",
              },
            ],
            "end": 15,
            "kind": "let",
            "loc": SourceLocation {
              "end": Position {
                "column": 14,
                "index": 15,
                "line": 2,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 4,
                "index": 5,
                "line": 2,
              },
            },
            "start": 5,
            "type": "VariableDeclaration",
          },
          Node {
            "declarations": [
              Node {
                "end": 32,
                "id": Node {
                  "end": 28,
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 12,
                      "index": 28,
                      "line": 3,
                    },
                    "filename": undefined,
                    "identifierName": "bb",
                    "start": Position {
                      "column": 10,
                      "index": 26,
                      "line": 3,
                    },
                  },
                  "name": "bb",
                  "start": 26,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 32,
                  "extra": {
                    "raw": "2",
                    "rawValue": 2,
                  },
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 16,
                      "index": 32,
                      "line": 3,
                    },
                    "filename": undefined,
                    "identifierName": undefined,
                    "start": Position {
                      "column": 15,
                      "index": 31,
                      "line": 3,
                    },
                  },
                  "start": 31,
                  "type": "NumericLiteral",
                  "value": 2,
                },
                "loc": SourceLocation {
                  "end": Position {
                    "column": 16,
                    "index": 32,
                    "line": 3,
                  },
                  "filename": undefined,
                  "identifierName": undefined,
                  "start": Position {
                    "column": 10,
                    "index": 26,
                    "line": 3,
                  },
                },
                "start": 26,
                "type": "VariableDeclarator",
              },
            ],
            "end": 32,
            "kind": "const",
            "loc": SourceLocation {
              "end": Position {
                "column": 16,
                "index": 32,
                "line": 3,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 4,
                "index": 20,
                "line": 3,
              },
            },
            "start": 20,
            "type": "VariableDeclaration",
          },
          Node {
            "async": false,
            "body": Node {
              "body": [],
              "directives": [],
              "end": 53,
              "loc": SourceLocation {
                "end": Position {
                  "column": 20,
                  "index": 53,
                  "line": 4,
                },
                "filename": undefined,
                "identifierName": undefined,
                "start": Position {
                  "column": 18,
                  "index": 51,
                  "line": 4,
                },
              },
              "start": 51,
              "type": "BlockStatement",
            },
            "end": 53,
            "generator": false,
            "id": Node {
              "end": 48,
              "loc": SourceLocation {
                "end": Position {
                  "column": 15,
                  "index": 48,
                  "line": 4,
                },
                "filename": undefined,
                "identifierName": "cc",
                "start": Position {
                  "column": 13,
                  "index": 46,
                  "line": 4,
                },
              },
              "name": "cc",
              "start": 46,
              "type": "Identifier",
            },
            "loc": SourceLocation {
              "end": Position {
                "column": 20,
                "index": 53,
                "line": 4,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 4,
                "index": 37,
                "line": 4,
              },
            },
            "params": [],
            "start": 37,
            "type": "FunctionDeclaration",
          },
          Node {
            "body": Node {
              "body": [],
              "end": 69,
              "loc": SourceLocation {
                "end": Position {
                  "column": 15,
                  "index": 69,
                  "line": 5,
                },
                "filename": undefined,
                "identifierName": undefined,
                "start": Position {
                  "column": 13,
                  "index": 67,
                  "line": 5,
                },
              },
              "start": 67,
              "type": "ClassBody",
            },
            "end": 69,
            "id": Node {
              "end": 66,
              "loc": SourceLocation {
                "end": Position {
                  "column": 12,
                  "index": 66,
                  "line": 5,
                },
                "filename": undefined,
                "identifierName": "dd",
                "start": Position {
                  "column": 10,
                  "index": 64,
                  "line": 5,
                },
              },
              "name": "dd",
              "start": 64,
              "type": "Identifier",
            },
            "loc": SourceLocation {
              "end": Position {
                "column": 15,
                "index": 69,
                "line": 5,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 4,
                "index": 58,
                "line": 5,
              },
            },
            "start": 58,
            "superClass": null,
            "type": "ClassDeclaration",
          },
        ],
        "scriptSetupAst": [
          Node {
            "declarations": [
              Node {
                "end": 16,
                "id": Node {
                  "end": 12,
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 11,
                      "index": 12,
                      "line": 2,
                    },
                    "filename": undefined,
                    "identifierName": "a",
                    "start": Position {
                      "column": 10,
                      "index": 11,
                      "line": 2,
                    },
                  },
                  "name": "a",
                  "start": 11,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 16,
                  "extra": {
                    "raw": "1",
                    "rawValue": 1,
                  },
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 15,
                      "index": 16,
                      "line": 2,
                    },
                    "filename": undefined,
                    "identifierName": undefined,
                    "start": Position {
                      "column": 14,
                      "index": 15,
                      "line": 2,
                    },
                  },
                  "start": 15,
                  "type": "NumericLiteral",
                  "value": 1,
                },
                "loc": SourceLocation {
                  "end": Position {
                    "column": 15,
                    "index": 16,
                    "line": 2,
                  },
                  "filename": undefined,
                  "identifierName": undefined,
                  "start": Position {
                    "column": 10,
                    "index": 11,
                    "line": 2,
                  },
                },
                "start": 11,
                "type": "VariableDeclarator",
              },
            ],
            "end": 16,
            "kind": "let",
            "loc": SourceLocation {
              "end": Position {
                "column": 15,
                "index": 16,
                "line": 2,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 6,
                "index": 7,
                "line": 2,
              },
            },
            "start": 7,
            "type": "VariableDeclaration",
          },
          Node {
            "declarations": [
              Node {
                "end": 34,
                "id": Node {
                  "end": 30,
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 13,
                      "index": 30,
                      "line": 3,
                    },
                    "filename": undefined,
                    "identifierName": "b",
                    "start": Position {
                      "column": 12,
                      "index": 29,
                      "line": 3,
                    },
                  },
                  "name": "b",
                  "start": 29,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 34,
                  "extra": {
                    "raw": "2",
                    "rawValue": 2,
                  },
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 17,
                      "index": 34,
                      "line": 3,
                    },
                    "filename": undefined,
                    "identifierName": undefined,
                    "start": Position {
                      "column": 16,
                      "index": 33,
                      "line": 3,
                    },
                  },
                  "start": 33,
                  "type": "NumericLiteral",
                  "value": 2,
                },
                "loc": SourceLocation {
                  "end": Position {
                    "column": 17,
                    "index": 34,
                    "line": 3,
                  },
                  "filename": undefined,
                  "identifierName": undefined,
                  "start": Position {
                    "column": 12,
                    "index": 29,
                    "line": 3,
                  },
                },
                "start": 29,
                "type": "VariableDeclarator",
              },
            ],
            "end": 34,
            "kind": "const",
            "loc": SourceLocation {
              "end": Position {
                "column": 17,
                "index": 34,
                "line": 3,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 6,
                "index": 23,
                "line": 3,
              },
            },
            "start": 23,
            "type": "VariableDeclaration",
          },
          Node {
            "async": false,
            "body": Node {
              "body": [],
              "directives": [],
              "end": 54,
              "loc": SourceLocation {
                "end": Position {
                  "column": 19,
                  "index": 54,
                  "line": 4,
                },
                "filename": undefined,
                "identifierName": undefined,
                "start": Position {
                  "column": 17,
                  "index": 52,
                  "line": 4,
                },
              },
              "start": 52,
              "type": "BlockStatement",
            },
            "end": 54,
            "generator": false,
            "id": Node {
              "end": 49,
              "loc": SourceLocation {
                "end": Position {
                  "column": 14,
                  "index": 49,
                  "line": 4,
                },
                "filename": undefined,
                "identifierName": "c",
                "start": Position {
                  "column": 13,
                  "index": 48,
                  "line": 4,
                },
              },
              "name": "c",
              "start": 48,
              "type": "Identifier",
            },
            "loc": SourceLocation {
              "end": Position {
                "column": 19,
                "index": 54,
                "line": 4,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 4,
                "index": 39,
                "line": 4,
              },
            },
            "params": [],
            "start": 39,
            "type": "FunctionDeclaration",
          },
          Node {
            "body": Node {
              "body": [],
              "end": 69,
              "loc": SourceLocation {
                "end": Position {
                  "column": 14,
                  "index": 69,
                  "line": 5,
                },
                "filename": undefined,
                "identifierName": undefined,
                "start": Position {
                  "column": 12,
                  "index": 67,
                  "line": 5,
                },
              },
              "start": 67,
              "type": "ClassBody",
            },
            "end": 69,
            "id": Node {
              "end": 66,
              "loc": SourceLocation {
                "end": Position {
                  "column": 11,
                  "index": 66,
                  "line": 5,
                },
                "filename": undefined,
                "identifierName": "d",
                "start": Position {
                  "column": 10,
                  "index": 65,
                  "line": 5,
                },
              },
              "name": "d",
              "start": 65,
              "type": "Identifier",
            },
            "loc": SourceLocation {
              "end": Position {
                "column": 14,
                "index": 69,
                "line": 5,
              },
              "filename": undefined,
              "identifierName": undefined,
              "start": Position {
                "column": 4,
                "index": 59,
                "line": 5,
              },
            },
            "start": 59,
            "superClass": null,
            "type": "ClassDeclaration",
          },
        ],
        "setup": true,
        "type": "script",
      }
    `)


    // expect(descriptor).toMatchInlineSnapshot(`
    //   {
    //     "cssVars": [],
    //     "customBlocks": [],
    //     "filename": "anonymous.vue",
    //     "script": null,
    //     "scriptSetup": null,
    //     "shouldForceReload": [Function],
    //     "slotted": false,
    //     "source": "
    //       <template>
    //       <div> </div>
    //   </template>

    //   <script setup>
    //   </script>
    //   <style>
    //   </style>

    //       ",
    //     "styles": [],
    //     "template": {
    //       "ast": {
    //         "children": [
    //           {
    //             "content": "    ",
    //             "loc": {
    //               "end": {
    //                 "column": 5,
    //                 "line": 3,
    //                 "offset": 20,
    //               },
    //               "source": "
    //       ",
    //               "start": {
    //                 "column": 15,
    //                 "line": 2,
    //                 "offset": 15,
    //               },
    //             },
    //             "type": 2,
    //           },
    //           {
    //             "children": [
    //               {
    //                 "content": " ",
    //                 "loc": {
    //                   "end": {
    //                     "column": 11,
    //                     "line": 3,
    //                     "offset": 26,
    //                   },
    //                   "source": " ",
    //                   "start": {
    //                     "column": 10,
    //                     "line": 3,
    //                     "offset": 25,
    //                   },
    //                 },
    //                 "type": 2,
    //               },
    //             ],
    //             "codegenNode": undefined,
    //             "isSelfClosing": false,
    //             "loc": {
    //               "end": {
    //                 "column": 17,
    //                 "line": 3,
    //                 "offset": 32,
    //               },
    //               "source": "<div> </div>",
    //               "start": {
    //                 "column": 5,
    //                 "line": 3,
    //                 "offset": 20,
    //               },
    //             },
    //             "ns": 0,
    //             "props": [],
    //             "tag": "div",
    //             "tagType": 0,
    //             "type": 1,
    //           },
    //           {
    //             "content": "
    //   ",
    //             "loc": {
    //               "end": {
    //                 "column": 1,
    //                 "line": 4,
    //                 "offset": 33,
    //               },
    //               "source": "
    //   ",
    //               "start": {
    //                 "column": 17,
    //                 "line": 3,
    //                 "offset": 32,
    //               },
    //             },
    //             "type": 2,
    //           },
    //         ],
    //         "codegenNode": undefined,
    //         "isSelfClosing": false,
    //         "loc": {
    //           "end": {
    //             "column": 12,
    //             "line": 4,
    //             "offset": 44,
    //           },
    //           "source": "<template>
    //       <div> </div>
    //   </template>",
    //           "start": {
    //             "column": 5,
    //             "line": 2,
    //             "offset": 5,
    //           },
    //         },
    //         "ns": 0,
    //         "props": [],
    //         "tag": "template",
    //         "tagType": 0,
    //         "type": 1,
    //       },
    //       "attrs": {},
    //       "content": "
    //       <div> </div>
    //   ",
    //       "loc": {
    //         "end": {
    //           "column": 1,
    //           "line": 4,
    //           "offset": 33,
    //         },
    //         "source": "
    //       <div> </div>
    //   ",
    //         "start": {
    //           "column": 15,
    //           "line": 2,
    //           "offset": 15,
    //         },
    //       },
    //       "map": {
    //         "file": "anonymous.vue",
    //         "mappings": ";IAEI,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC",
    //         "names": [],
    //         "sourceRoot": "",
    //         "sources": [
    //           "anonymous.vue",
    //         ],
    //         "sourcesContent": [
    //           "
    //       <template>
    //       <div> </div>
    //   </template>

    //   <script setup>
    //   </script>
    //   <style>
    //   </style>

    //       ",
    //         ],
    //         "version": 3,
    //       },
    //       "type": "template",
    //     },
    //   }
    // `)
  })
})
