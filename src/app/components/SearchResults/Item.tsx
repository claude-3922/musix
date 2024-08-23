import { SongData } from "@/util/types/SongData";
import React from "react";

interface ItemProps {
  data: SongData;
}

export default function Item({ data }: ItemProps) {
  const { vid, owner, playerInfo } = data;

  return <div>Item</div>;
}
