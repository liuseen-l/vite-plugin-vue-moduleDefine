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
    import { x } from './x'
      let a = 1
      const b = 2
    function c() {}
    class d {}
    </script>
    <script>
    import { xx } from './x'
    let aa = 1
    const bb = 2
    function cc() {}
    class dd {}
    </script>
    `
    const { descriptor } = _parse(script)
    const content = compileScript(descriptor, { id: 'v' })

    expect(content.imports).toMatchInlineSnapshot(`
      {
        "x": {
          "imported": "x",
          "isFromSetup": true,
          "isType": false,
          "isUsedInTemplate": true,
          "local": "x",
          "source": "./x",
        },
        "xx": {
          "imported": "xx",
          "isFromSetup": false,
          "isType": false,
          "isUsedInTemplate": true,
          "local": "xx",
          "source": "./x",
        },
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
