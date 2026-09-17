import { useEffect, useState, useCallback, useMemo } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import {
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  FaGlobe,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaFilter,
  FaSync,
} from "react-icons/fa";
import { getCountries, createCountry, updateCountry, deleteCountry } from "../services/country.service";
import { CountryMastersDto, CountryDto } from "../models/country.dto";

interface CountryFormState {
  countryName: string;
  isoCode: string;
  phoneCode: string;
}

const emptyForm: CountryFormState = {
  countryName: "",
  isoCode: "",
  phoneCode: "",
};

export function Country() {
  const [data, setData] = useState<CountryMastersDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CountryMastersDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedIsoFilter, setSelectedIsoFilter] = useState<string | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [formData, setFormData] = useState<CountryFormState>(emptyForm);
  const [loading, setLoading] = useState(false);

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCountries();
      const countries = result.data || result || [];
      setData(countries);
    } catch (error) {
      console.error("Load countries failed:", error);
      setData([]);
      alert("Failed to load countries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  const isoOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.isoCode).filter(Boolean)))
      .sort()
      .map((code) => ({ value: code, label: code }));
  }, [data]);

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = useCallback((record: CountryMastersDto) => {
    setEditingRecord(record);
    setFormData({
      countryName: record.name || "",
      isoCode: record.isoCode || "",
      phoneCode: record.phoneCode || "",
    });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = formData.countryName.trim();
    const trimmedIso = formData.isoCode.trim();
    const trimmedPhone = formData.phoneCode.trim();

    if (!trimmedName || !trimmedIso || !trimmedPhone) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const countryData: CountryDto = {
        name: trimmedName,
        isoCode: trimmedIso.toUpperCase(),
        phoneCode: trimmedPhone,
      };

      let result;
      if (editingRecord?.id) {
        result = await updateCountry({
          ...editingRecord,
          ...countryData,
          id: editingRecord.id,
        });
      } else {
        result = await createCountry(countryData);
      }

      if (result.success) {
        alert(editingRecord ? "Country updated successfully" : "Country created successfully");
        handleCloseModal();
        await loadCountries();
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this country? This action cannot be undone.")) {
        return;
      }

      try {
        const res = await deleteCountry(id);
        if (res.success) {
          setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
          await loadCountries();
          alert(res.message || "Country deleted successfully");
        } else {
          alert(res.message || "Delete failed");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Delete failed");
      }
    },
    [loadCountries]
  );

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    if (!window.confirm(`Delete ${selectedRowKeys.length} selected country(ies)?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedRowKeys.map((id) => deleteCountry(Number(id))));
      setSelectedRowKeys([]);
      await loadCountries();
      alert("Selected countries deleted successfully");
    } catch (error) {
      console.error("Bulk delete failed:", error);
      alert("Failed to delete selected items");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const matchesIso = selectedIsoFilter ? item.isoCode === selectedIsoFilter : true;
      const matchesSearch =
        !search ||
        [item.name, item.isoCode, item.phoneCode]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));

      return matchesIso && matchesSearch;
    });
  }, [data, searchText, selectedIsoFilter]);

  const columns = useMemo<TableColumn<CountryMastersDto>[]>(
    () => [
      {
        name: "Name",
        selector: (row) => row.name || "-",
        sortable: true,
        grow: 2,
        wrap: true,
        cell: (row) => (
          <div className="d-flex align-items-center gap-2">
            <FaGlobe className="text-primary" />
            <span className="fw-semibold text-dark">{row.name || "-"}</span>
          </div>
        ),
      },
      {
        name: "ISO Code",
        selector: (row) => row.isoCode || "-",
        sortable: true,
        center: true,
        width: "110px",
        cell: (row) => (row.isoCode ? <Badge bg="primary">{row.isoCode}</Badge> : "-"),
      },
      {
        name: "Phone Code",
        selector: (row) => row.phoneCode || "-",
        sortable: true,
        width: "130px",
        cell: (row) => row.phoneCode || "-",
      },
      {
        name: "Created",
        selector: (row) => row.createdAt || "",
        sortable: true,
        hide: 768,
        width: "145px",
        sortFunction: (first, second) =>
          new Date(first.createdAt || 0).getTime() - new Date(second.createdAt || 0).getTime(),
        cell: (row) =>
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-",
      },
      {
        name: "Edited",
        selector: (row) => row.updatedAt || "",
        sortable: true,
        hide: 768,
        width: "145px",
        sortFunction: (first, second) =>
          new Date(first.updatedAt || 0).getTime() - new Date(second.updatedAt || 0).getTime(),
        cell: (row) =>
          row.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-",
      },
      {
        name: "Actions",
        center: true,
        width: "170px",
        cell: (row) => (
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => handleOpenEditModal(row)} className="d-flex align-items-center gap-1">
              <FaEdit />
              Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row.id)} className="d-flex align-items-center gap-1">
              <FaTrash />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete, handleOpenEditModal]
  );

  return (
    <div className="country-page p-2 p-md-4 bg-light min-vh-100">
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="flex-grow-1">
            <h3 className="mb-1 fw-bold text-dark fs-4 fs-md-3">Country Master</h3>
            <small className="text-muted d-block">
              Configure and manage global countries, ISO records, and calling codes.
            </small>
          </div>

          <div className="country-page-actions d-flex justify-content-end gap-2 flex-wrap ms-md-auto">
            {selectedRowKeys.length > 0 && (
              <Button variant="danger" onClick={handleBulkDelete} className="d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0">
                <FaTrash />
                Delete Selected ({selectedRowKeys.length})
              </Button>
            )}
            <Button variant="primary" onClick={handleOpenCreateModal} className="d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0">
              <FaPlus />
              Add New
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-2 p-sm-3 p-md-4">
            <div className="bg-light rounded-3 border p-3 mb-3">
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <FaFilter className="text-primary" />
                <strong className="text-dark">Filter & Search Parameters</strong>
              </div>

              <Row className="g-3 align-items-center">
                <Col xs={12} md={6} lg={7}>
                  <div className="position-relative">
                    <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-secondary" />
                    <Form.Control
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search country, ISO code, phone code..."
                      className="ps-5 rounded-3"
                    />
                  </div>
                </Col>

                <Col xs={12} md={4} lg={3}>
                  <Form.Select
                    value={selectedIsoFilter ?? ""}
                    onChange={(e) => setSelectedIsoFilter(e.target.value || undefined)}
                    className="rounded-3"
                  >
                    <option value="">Filter by ISO Code</option>
                    {isoOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                </Col>

                <Col xs={12} md={2} lg={2}>
                  <Button variant="outline-secondary" className="w-100 rounded-3 d-flex align-items-center justify-content-center gap-2" onClick={() => {
                    setSearchText("");
                    setSelectedIsoFilter(undefined);
                  }}>
                    <FaSync />
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3 px-1 flex-wrap gap-2">
              <small className="text-muted">Showing {filteredData.length} countries</small>
              {selectedRowKeys.length > 0 && (
                <small className="text-primary fw-semibold">{selectedRowKeys.length} country(ies) selected</small>
              )}
            </div>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" variant="primary" role="status" />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                keyField="id"
                selectableRows
                selectableRowsHighlight
                onSelectedRowsChange={({ selectedRows }) => setSelectedRowKeys(selectedRows.map((row) => row.id))}
                clearSelectedRows={selectedRowKeys.length === 0}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                progressPending={loading}
                persistTableHead
                highlightOnHover
                className="country-data-table"
                responsive
                noDataComponent={<div className="py-4 text-muted">No countries found</div>}
                customStyles={{
                  headCells: { style: { fontWeight: 600, color: "#212529", backgroundColor: "#f8f9fa" } },
                  rows: { style: { minHeight: "58px" } },
                  cells: { style: { paddingLeft: "12px", paddingRight: "12px" } },
                }}
              />
            )}
          </Card.Body>
        </Card>

        <Modal show={isModalOpen} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingRecord ? "Edit Country" : "Create Country"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Country Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.countryName}
                  onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                  placeholder="e.g. India"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">ISO Code</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.isoCode}
                  maxLength={3}
                  onChange={(e) => setFormData({ ...formData, isoCode: e.target.value })}
                  placeholder="e.g. IND"
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Phone Code</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phoneCode}
                  onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                  placeholder="e.g. +91"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Saving..." : editingRecord ? "Update" : "Create"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}