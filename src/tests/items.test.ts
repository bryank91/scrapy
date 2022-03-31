import { Items } from "../data/items";

const newFileContent = "test1\ntest2\ntest3\ntest4"
const oldFileContent = "test1\ntest2\ntest3\ntest4"
const desimilarNewFileContent = "test1\ntest2\ntest3\ntest4\ntest5"

test('should return empty string for enumerationComparitor', () => {
    expect(
        Items.compareTwoArraysWithNewLineEnumeration(newFileContent,oldFileContent)
    ).toStrictEqual([])
  });

test('should return one string for enumerationComparitor', () => {
    expect(
        Items.compareTwoArraysWithNewLineEnumeration(desimilarNewFileContent,oldFileContent)
    ).toStrictEqual(['test5'])
});