using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSMS.Domain.Domains
{
    public class Patienttable
    {
        public int? PatientId { get; set; }
        public string? MedicalRecordNumber { get; set; } 
        public string? FirstName { get; set; } 
        public string? LastName { get; set; } 
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset CreatedAt { get; set; }

        public Patienttable(int? patientId, string? medicalRecordNumber, string? firstName, string? lastName, DateTime? dateOfBirth, string? gender, string? phoneNumber, string? email, bool isActive, DateTimeOffset createdAt)
        {
            PatientId = patientId;
            MedicalRecordNumber = medicalRecordNumber;
            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            PhoneNumber = phoneNumber;
            Email = email;
            IsActive = isActive;
            CreatedAt = createdAt;
        }
    }
}
