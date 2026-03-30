import { Eye, Search, Users, Edit } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UpdateArtistAction } from "./UpdateArtistAction";
import RevealOnScroll from "../decoratives/RevealOnScroll";
import { ArtistCard } from "./ArtistCard";
import { DataTable, Button, Badge } from "../ui";

export function ArtistTable({ artists }) {
  const columns = [
    {
      header: 'Photo',
      accessor: 'image',
      render: (value, row) => (
        <div className="h-12 w-12 rounded-full bg-kcb-ardoise flex items-center justify-center overflow-hidden">
          <img
            loading="lazy"
            src={value}
            alt={row.name}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      )
    },
    {
      header: 'Nom',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Pays',
      accessor: 'country',
      sortable: true
    },
    {
      header: 'Oeuvres approuvées',
      accessor: 'artworkCount',
      sortable: true,
      render: (value) => (
        <Badge variant="info">{value || 0}</Badge>
      )
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => (
        <div className="flex gap-2">
          <Link to={`/artist/${value}`}>
            <Button variant="ghost" size="sm" icon={Eye}>
              Voir
            </Button>
          </Link>
          <UpdateArtistAction artist={row} />
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={artists || []}
      columns={columns}
      searchable={true}
      pagination={true}
      pageSize={10}
      emptyMessage="Aucun artiste trouvé"
    />
  );
}
