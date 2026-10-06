import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import Avatar from "../../components/Avatar";
import SkeletonRow from "../../components/SkeletonRow";
import ScheduleInterviewModal from "../../components/ScheduleInterviewModal";
import { formatRelativeDate } from "../../utils/formatDate";
import { Search, ArrowUp, ArrowDown, ArrowUpDown, Users } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-700",
  Reviewed: "bg-blue-50 text-blue-700",
  Shortlisted: "bg-purple-50 text-purple-700",
  Interviewed: "bg-indigo-50 text-indigo-700",
  Rejected: "bg-red-50 text-red-700",
  Hired: "bg-green-50 text-green-700",
};

const statusDots = {
  Pending: "bg-yellow-500",
  Reviewed: "bg-blue-500",
  Shortlisted: "bg-purple-500",
  Interviewed: "bg-indigo-500",
  Rejected: "bg-red-500",
  Hired: "bg-green-500",
};

const statusFilterOptions = [
  { value: "All", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Shortlisted", label: "Shortlisted" },
  { value: "Interviewed", label: "Interview" },
  { value: "Hired", label: "Hired" },
  { value: "Rejected", label: "Rejected" },
];

const statusUpdateOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Shortlisted", label: "Shortlisted" },
  { value: "Interviewed", label: "Interviewed" },
  { value: "Hired", label: "Hired" },
];

const columns = [
  { key: "name", label: "Candidate" },
  { key: "email", label: "Email" },
  { key: "jobTitle", label: "Applied For" },
  { key: "appliedDate", label: "Applied" },
  { key: "resume", label: "Resume" },
  { key: "status", label: "Status" },
];

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("appliedDate");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [scheduleFor, setScheduleFor] = useState(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/applications/recruiter/all", {
        params: {
          search,
          status: statusFilter,
          sortBy,
          order,
          page,
          limit: 10,
        },
      });

      setApplications(res.data.applications);
      setTotalPages(res.data.totalPages);
      setTotalApplicants(res.data.totalApplicants);
    } catch {
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, order, page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchApplicants();
    }, 300);

    return () => clearTimeout(debounce);
  }, [fetchApplicants]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleSort = (col) => {
    if (sortBy === col) {
      if (order === "asc") {
        setOrder("desc");
      } else if (order === "desc") {
        setSortBy("appliedDate");
        setOrder("desc");
      }
    } else {
      setSortBy(col);
      setOrder("asc");
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) {
      return (
        <ArrowUpDown
          size={12}
          className="text-gray-300 group-hover:text-orange-400"
        />
      );
    }

    return order === "asc" ? (
      <ArrowUp size={12} className="text-orange-500" />
    ) : (
      <ArrowDown size={12} className="text-orange-500" />
    );
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });

      toast.success(`Marked as ${status}`);

      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );

      if (status === "Shortlisted") {
        const app = applications.find((a) => a._id === id);

        if (app) {
          setScheduleFor(app);
        }
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      {/* Header - ORIGINAL STRUCTURE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>

        <p className="text-sm text-gray-500 mt-1">
          {totalApplicants} total applicants
        </p>
      </div>

      {/* Search + Filter - ORIGINAL STRUCTURE */}
      <div className="flex gap-3 mt-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="
              absolute left-3.5 top-1/2 -translate-y-1/2
              text-gray-400
              pointer-events-none
            "
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or job title..."
            className="
              w-full h-11
              pl-10 pr-4
              rounded-xl
              border border-gray-200
              bg-white
              text-sm text-gray-800
              placeholder:text-gray-400

              hover:border-orange-300
              hover:bg-orange-50/30

              focus:outline-none
              focus:border-orange-400
              focus:ring-4
              focus:ring-orange-400/10

              transition-all duration-200
            "
          />
        </div>

        <Dropdown
          options={statusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-48"
        />
      </div>

      {/* TABLE - ORIGINAL SIZE / STRUCTURE */}
      <div
        className="
          mt-6
          bg-white
          rounded-xl
          shadow-sm
          border border-gray-100
          overflow-hidden

          hover:border-orange-100
          hover:shadow-md

          transition-all duration-200
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead
              className="
                text-left
                text-sm
                font-medium
                text-gray-500
                bg-gray-50/60
              "
            >
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="
                      px-3 py-2.5
                      cursor-pointer
                      select-none
                      hover:text-orange-600
                      transition-colors
                      border-b border-gray-100
                      whitespace-nowrap
                    "
                  >
                    <div className="flex items-center gap-1">
                      {col.label}

                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}

                <th
                  className="
                    px-3 py-2.5
                    border-b border-gray-100
                    whitespace-nowrap
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {/* Loading */}
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : applications.length === 0 ? (
                /* Empty State */
                <tr>
                  <td colSpan={7} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="
                          w-14 h-14
                          rounded-2xl
                          bg-orange-50
                          flex items-center justify-center
                          mb-3

                          hover:bg-orange-500
                          transition-colors duration-200
                        "
                      >
                        <Users size={26} className="text-orange-500" />
                      </div>

                      <p className="font-medium text-gray-600">
                        No applicants found
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app._id}
                    className="
                      group
                      border-b border-gray-100
                      last:border-b-0

                      hover:bg-orange-50
                      hover:border-orange-100

                      transition-all duration-200
                    "
                  >
                    {/* Candidate */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                            rounded-xl
                            transition-all duration-200
                            group-hover:scale-105
                          "
                        >
                          <Avatar
                            name={app.candidate?.name}
                            imageUrl={
                              app.candidate?.profilePic
                                ? `${BASE_URL}${app.candidate.profilePic}`
                                : null
                            }
                            size="sm"
                          />
                        </div>

                        <span
                          className="
                            font-medium
                            text-gray-900
                            text-sm
                            group-hover:text-orange-700
                            transition-colors
                          "
                        >
                          {app.candidate?.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-3 py-2.5">
                      <a
                        href={`mailto:${app.candidate?.email}`}
                        title={app.candidate?.email}
                        className="block max-w-[15ch] truncate text-gray-600 hover:text-orange-500 hover:underline text-sm"
                      >
                        {app.candidate?.email}
                      </a>
                    </td>

                    {/* Job */}
                    <td className="px-3 py-2.5 text-gray-700 text-sm">
                      {app.job?.title}
                    </td>

                    {/* Date */}
                    <td className="px-3 py-2.5 text-gray-500 text-sm whitespace-nowrap">
                      {formatRelativeDate(app.createdAt)}
                    </td>

                    {/* Resume */}
                    <td className="px-3 py-2.5">
                      {app.resumeUrl ? (
                        <a
                          href={`${BASE_URL}${app.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex
                            items-center
                            px-3 py-1.5
                            rounded-lg

                            bg-orange-50
                            text-orange-500
                            border border-orange-100

                            font-medium
                            text-sm

                            hover:bg-orange-500
                            hover:text-white
                            hover:border-orange-500
                            hover:scale-105

                            transition-all duration-200
                          "
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2.5">
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            statusColors[app.status] ||
                            "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        <span
                          className={`
                            w-1.5
                            h-1.5
                            rounded-full
                            ${statusDots[app.status] || "bg-gray-400"}
                          `}
                        />

                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatus(app._id, e.target.value)
                          }
                          className="
                            h-8
                            px-2
                            rounded-lg
                            border border-gray-200
                            text-xs
                            bg-white
                            text-gray-600
                            cursor-pointer

                            hover:border-orange-300
                            hover:bg-orange-50

                            focus:outline-none
                            focus:border-orange-400
                            focus:ring-2
                            focus:ring-orange-400/10

                            transition-all duration-200
                          "
                        >
                          {statusUpdateOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => updateStatus(app._id, "Rejected")}
                          className="
                            h-8
                            px-3
                            rounded-lg
                            border border-red-200
                            bg-red-50
                            text-red-600
                            text-xs
                            font-medium

                            hover:bg-red-500
                            hover:text-white
                            hover:border-red-500
                            hover:scale-105

                            transition-all duration-200
                          "
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - ORIGINAL STRUCTURE */}
      {!loading && applications.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-700">{page}</span> of{" "}
            <span className="font-medium text-gray-700">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3! py-1.5! text-sm!"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`
                  w-8 h-8
                  rounded-lg
                  text-sm
                  font-medium
                  transition-all duration-200

                  ${
                    p === page
                      ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:scale-105"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-100"
                  }
                `}
              >
                {p}
              </button>
            ))}

            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3! py-1.5! text-sm!"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Schedule Interview */}
      {scheduleFor && (
        <ScheduleInterviewModal
          application={scheduleFor}
          onClose={() => setScheduleFor(null)}
          onScheduled={() => setScheduleFor(null)}
        />
      )}
    </div>
  );
};

export default Applicants;
