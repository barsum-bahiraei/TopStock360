using Store.Domain.Invoices;

namespace Store.Domain.Accounts.Models.Output;

public class DiscountCodeListOutput
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal MinimumPurchaseAmount { get; set; }
    public PaymentMethodEnum? PaymentMethod { get; set; }
    public DateTime? ExpireAt { get; set; }
    public bool IsActive { get; set; }
}

public class DiscountCodeOutput
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal MinimumPurchaseAmount { get; set; }
    public PaymentMethodEnum? PaymentMethod { get; set; }
    public DateTime? ExpireAt { get; set; }
    public bool IsActive { get; set; }
}
