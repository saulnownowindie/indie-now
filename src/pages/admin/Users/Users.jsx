import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

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
  const [editingUser, setEditingUser] = useState(null);

  const { data: users = [], isLoading, isError } = useUsers();

  function openCreateModal() {
    setEditingUser(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingUser(null);
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
            { key: "actions", label: "Acciones" },
          ]}
        >
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <TableEmpty
                  title="Cargando usuarios"
                  description="Obteniendo datos..."
                />
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={4}>
                <TableEmpty
                  title="Error"
                  description="No se pudieron cargar los usuarios."
                />
              </td>
            </tr>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <tr>
              <td colSpan={4}>
                <TableEmpty
                  title="No hay usuarios"
                  description="Agrega el primer usuario."
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            users.map((user) => {
              const avatarUrl = resolveMediaUrl(user.avatarUrl);
              const initial = (user.name || "?").trim().charAt(0).toUpperCase();

              return (
                <tr key={user.id}>
                  <td>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.name}
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
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <div className="users-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Pencil size={15} />}
                        onClick={() => {
                          setEditingUser(user);
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </DataTable>
      </PageLayout>

      {modalOpen && (
        <UserModal
          key={editingUser?.id ?? "new"}
          onClose={closeModal}
          user={editingUser}
        />
      )}
    </>
  );
}