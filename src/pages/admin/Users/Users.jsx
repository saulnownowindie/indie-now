import { useState } from "react";
import { Plus } from "lucide-react";

import "./Users.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import Button from "../../../components/admin/ui/Button";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import UserModal from "../../../components/admin/modals/UserModal";

import useUsers from "../../../hooks/useUsers";
import { resolveMediaUrl } from "../../../utils/mediaUrl";

export default function Users() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: users = [], isLoading, isError } = useUsers();

  function openCreateModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <>
      <PageLayout
        title="Equipo"
        description="Administra los usuarios del panel."
        action={
          <Button
            icon={<Plus size={18} />}
            onClick={openCreateModal}
          >
            Agregar Nuevo Usuario
          </Button>
        }
      >
        <DataTable
          columns={[
            { key: "avatar", label: "Avatar" },
            { key: "name", label: "Nombre" },
            { key: "email", label: "Email" },
          ]}
        >
          {isLoading && (
            <tr>
              <td colSpan={3}>
                <TableEmpty
                  title="Cargando usuarios"
                  description="Obteniendo datos..."
                />
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={3}>
                <TableEmpty
                  title="Error"
                  description="No se pudieron cargar los usuarios."
                />
              </td>
            </tr>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <tr>
              <td colSpan={3}>
                <TableEmpty
                  title="No hay usuarios"
                  description="Agrega el primer usuario."
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            users.map((item) => {
              const avatarUrl = resolveMediaUrl(item.avatarUrl, 80);
              const initial = (item.name || "?").trim().charAt(0).toUpperCase();

              return (
                <tr key={item.id}>
                  <td>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={item.name}
                        className="users-table-avatar"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="users-table-avatar-fallback">
                        {initial}
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.email}</td>
                </tr>
              );
            })}
        </DataTable>
      </PageLayout>

      {modalOpen && (
        <UserModal
          key="new"
          onClose={closeModal}
        />
      )}
    </>
  );
}