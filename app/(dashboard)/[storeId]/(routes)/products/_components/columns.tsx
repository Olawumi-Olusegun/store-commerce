"use client"

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";


export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  color: string;
  isFeatured: string;
  isArchived: string;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="rounded-full h-6 w-6 border" style={{ backgroundColor: row.original.color }} />
      </div>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "IsFeatured",
  },
  {
    accessorKey: "isArchived",
    header: "IsArchived",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "action",
    cell: ({row}) => <CellAction data={row.original} />,
  },
];
