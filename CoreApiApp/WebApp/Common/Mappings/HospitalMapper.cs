using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Responses;
using Newtonsoft.Json;

namespace CoreApiApp.Common.Mappings;

public static class HospitalMapper
{
    public static HospitalResponse ToResponse(Hospital hospital)
    {
        var address = JsonConvert.DeserializeObject<Address>(hospital.Address);
        
        return new HospitalResponse
        {
            Guid = hospital.Guid,
            Name = hospital.Name,
            EmailId = hospital.EmailId,
            Address = new Address()
            {
                Street = address!.Street,
                City = address.City,
                State = address.State,
                Pincode = address.Pincode
            },
            ContactInfo = hospital.ContactInfo,
            SetupStatus = hospital.SetupStatus,
            PlanStatus = hospital.PlanStatus,
            PlanExpiresOn = hospital.PlanExpiresOn,
        };
    }
    
    public static List<HospitalResponse> ToResponseList(List<Hospital> hospitals)
    {
        return hospitals.Select(h => ToResponse(h)).ToList();
    }
}