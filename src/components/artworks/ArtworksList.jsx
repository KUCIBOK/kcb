import { CheckCircle, ChevronLeft, ChevronRight, Clock, Image, Search, XCircle } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { SeeAction } from "./SeeAction";
import { ApproveAction } from "./ApproveAction";
import { DownloadAction } from "./DownloadAction";
import { UpdateEtherscan } from "./UpdateEtherscan";
import { UpdateArtworkAction } from "./UpdateArtworkAction";
import { DataTable, Badge, StatusBadge } from "../ui";

export const ArtworksList = ({artworks, user}) => {
    const getStatusVariant = (status) => {
        switch(status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'danger';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'approved': return 'Approuvée';
            case 'pending': return 'En attente';
            case 'rejected': return 'Refusée';
            default: return status;
        }
    };

    const columns = [
        {
            header: 'Aperçu',
            accessor: 'image',
            render: (value, row) => (
                <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                        loading="lazy"
                        src={value}
                        alt={row.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )
        },
        {
            header: 'Titre',
            accessor: 'title',
            sortable: true
        },
        {
            header: 'Artiste',
            accessor: 'artist',
            sortable: true
        },
        ...(user?.role !== "collector" ? [
            {
                header: 'Créé',
                accessor: 'created',
                sortable: true,
                render: (value) => new Date(value).toLocaleDateString('fr-FR')
            },
            {
                header: 'Statut',
                accessor: 'status',
                render: (value) => (
                    <StatusBadge status={getStatusVariant(value)}>
                        {getStatusLabel(value)}
                    </StatusBadge>
                )
            }
        ] : [
            {
                header: 'Aquis le',
                accessor: 'acquired',
                sortable: true,
                render: (value) => new Date(value).toLocaleDateString('fr-FR')
            }
        ]),
        {
            header: 'Prix',
            accessor: 'price',
            sortable: true,
            render: (value, row) => `${value?.toLocaleString('fr-FR')} ${row.currency || ''}`
        },
        {
            header: 'Visitée',
            accessor: 'visited',
            sortable: true
        },
        {
            header: 'Etherscan',
            accessor: 'etherscan',
            render: (value) => value 
                ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Voir</a>
                : <span className="text-gray-500 italic text-xs">À venir</span>
        },
        {
            header: 'Certificat',
            accessor: 'certificatePath',
            render: (value) => value
                ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Voir</a>
                : <span className="text-gray-500 italic text-xs">À venir</span>
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (value, row) => (
                <div className="flex justify-end items-center gap-2">
                    <DownloadAction artwork={row} />
                    <SeeAction user={user} artwork={row} />
                    {user?.role !== "collector" && <UpdateArtworkAction artwork={row} />}
                    {user?.role === "admin" && <ApproveAction artwork={row} />}
                    {user?.role === "admin" && <UpdateEtherscan artwork={row} />}
                </div>
            )
        }
    ];

    return (
        <DataTable
            data={artworks || []}
            columns={columns}
            searchable={true}
            pagination={true}
            pageSize={40}
            emptyMessage="Aucune œuvre trouvée"
        />
    );
};
