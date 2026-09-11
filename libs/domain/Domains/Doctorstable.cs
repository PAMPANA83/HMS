using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Doctorstable
    {
        public int? Id { get; set; }  
        public int? BranchId { get; set; }
        public int? UserId { get; set; }  
        public int? DepartmentId { get; set; }
        public string? Specialization { get; set; }
        public string? LicenseNumber { get; set; }
        public decimal? ConsultationFee { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTimeOffset? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

        public Doctorstable(int? id,int? branchId, int? userId, int? departmentId, string? specialization, string? licenseNumber, decimal? consultationFee, bool isActive, DateTimeOffset? createdAt, int? createdBy, DateTimeOffset? updatedAt, int? updatedBy)
        {
            Id = id;
            BranchId = branchId;
            UserId = userId;
            DepartmentId = departmentId;
            Specialization = specialization;
            LicenseNumber = licenseNumber;
            ConsultationFee = consultationFee;
            IsActive = isActive;
            CreatedAt = createdAt;
            CreatedBy = createdBy;
            UpdatedAt = updatedAt;
            UpdatedBy = updatedBy;
        }
    }
}
