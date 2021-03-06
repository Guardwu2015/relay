/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @emails oncall+relay
 */

'use strict';

const GraphQLCompilerContext = require('GraphQLCompilerContext');
const RelayParser = require('RelayParser');
const RelayRelayDirectiveTransform = require('RelayRelayDirectiveTransform');
const RelayTestSchema = require('RelayTestSchema');

const getGoldenMatchers = require('getGoldenMatchers');

const {transformASTSchema} = require('ASTConvert');

describe('RelayRelayDirectiveTransform', () => {
  beforeEach(() => {
    expect.extend(getGoldenMatchers(__filename));
  });

  it('matches expected output', () => {
    expect('fixtures/relay-directive-transform').toMatchGolden(text => {
      const schema = transformASTSchema(RelayTestSchema, [
        RelayRelayDirectiveTransform.SCHEMA_EXTENSION,
      ]);
      const ast = RelayParser.parse(schema, text);
      return new GraphQLCompilerContext(RelayTestSchema, schema)
        .addAll(ast)
        .applyTransforms([RelayRelayDirectiveTransform.transform])
        .documents()
        .map(doc => JSON.stringify(doc, null, 2))
        .join('\n');
    });
  });
});
