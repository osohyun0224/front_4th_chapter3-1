import {
  Table as ChakraTable,
  TableBodyProps,
  TableCellProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';

type ContainerProps = TableProps & {
  children: React.ReactNode;
};

const Container = ({ children, ...props }: ContainerProps) => {
  return <ChakraTable {...props}>{children}</ChakraTable>;
};

type HeaderProps = TableHeadProps & {
  children: React.ReactNode;
};

const Header = ({ children, ...props }: HeaderProps) => {
  return <Thead {...props}>{children}</Thead>;
};

type BodyProps = TableBodyProps & {
  children: React.ReactNode;
};

const Body = ({ children, ...props }: BodyProps) => {
  return <Tbody {...props}>{children}</Tbody>;
};

type RowProps = TableRowProps & {
  children: React.ReactNode;
};

const Row = ({ children, ...props }: RowProps) => {
  return <Tr {...props}>{children}</Tr>;
};

type CellProps = TableCellProps & {
  children: React.ReactNode;
};

const Cell = ({ children, ...props }: CellProps) => {
  return <Td {...props}>{children}</Td>;
};

type ThProps = TableCellProps & {
  children: React.ReactNode;
};

const TableTh = ({ children, ...props }: ThProps) => {
  return <Th {...props}>{children}</Th>;
};

const Table = Object.assign(
  {},
  {
    Container,
    Header,
    Body,
    Row,
    Cell,
    Th: TableTh,
  }
);

export default Table;